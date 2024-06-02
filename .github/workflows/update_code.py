import argparse
import re
import time
import os
from github import Github

python_token = os.getenv('KEYPYTHON')
repository_source = os.getenv('REPOSITORY_SOURCE')
repository_receiver = os.getenv('REPOSITORY_RECEIVER')

def decrypt(text):
    text_inverse = text[::-1]
    return text_inverse

def update_docker_compose(content, old_version, new_version):
    pattern = re.compile(f'hackagon-front:{old_version}')
    updated_content = pattern.sub(f'hackagon-front:{new_version}', content)
    return updated_content

def main(python_token, repo_source, repo_receiver):
    g = Github(python_token)
    front_repo = g.get_repo(repo_source)
    infra_repo = g.get_repo(repo_receiver)

    tags = sorted(front_repo.get_tags(), key=lambda t: t.name, reverse=True)
    latest_tag = tags[0].name
    previous_tag = tags[1].name
    print(latest_tag, previous_tag)

    main_branch = infra_repo.get_branch('master')
    docker_compose_file = infra_repo.get_contents('docker-compose.yml', ref=main_branch.commit.sha)
    docker_compose_content = docker_compose_file.decoded_content.decode()

    new_docker_compose_content = update_docker_compose(docker_compose_content, previous_tag, latest_tag)

    new_branch_name = f'hackagon-deploy-{latest_tag}-front'
    main_sha = main_branch.commit.sha
    infra_repo.create_git_ref(ref=f'refs/heads/{new_branch_name}', sha=main_sha)

    infra_repo.update_file(docker_compose_file.path, f'Update hackagon-front to {latest_tag}', new_docker_compose_content, docker_compose_file.sha, branch=new_branch_name)

    pr = infra_repo.create_pull(
        title=f'Update hackagon-front to {latest_tag}',
        body=f'This PR updates the hackagon-front service to version {latest_tag}.',
        head=new_branch_name,
        base='master'
    )

    pr.merge()

    print(f'Successfully updated hackagon-front to {latest_tag} and merged the pull request.')

if __name__ == '__main__':
    print(python_token, repository_source, repository_receiver)
    token = decrypt(python_token)
    print(token)
    main(token, repository_source, repository_receiver)