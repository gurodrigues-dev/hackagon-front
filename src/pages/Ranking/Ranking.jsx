import "./Ranking.css";

// Hooks
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// Redux
import { getRanking, reset as resetRanking } from "../../slices/rankingSlice";
import { logout, reset } from "../../slices/authSlice";

// Components
import LoadingAnimation from "../../components/LoadingAnimation/LoadingAnimation";
import Navbar from "../../components/Navbar/Navbar";

// Icons
import { PiCoinVerticalFill } from "react-icons/pi";

export default function Ranking() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { ranking } = useSelector((state) => state.ranking);

  const verifyTokenValidity = (expirationDate) => {
    const currentDate = new Date().getTime();

    return currentDate > expirationDate ? false : true;
  };

  useEffect(() => {
    console.log(user)
    const tokenValidity = verifyTokenValidity(user.token.expiration);

    if (tokenValidity) {
      dispatch(getRanking());
    } else {
      dispatch(logout());
      dispatch(reset());

      navigate("/login")
    }
  }, []);

  // Reset value states
  useEffect(() => {
    dispatch(resetRanking());
  }, [dispatch]);

  // Reset value states
  useEffect(() => {
    console.log(ranking)
  }, [ranking]);



  return (
    <div className="ranking">
      <Navbar />
      <div className="wrapper-ranking">
        <div className="table">
          <div className="header-table">
            <div className="container">
              <span className="header-table__title">Posição</span>
            </div>
            <span className="header-table__title">Jogador</span>
            <div className="container">
              <span className="header-table__title">Pontuação</span>
            </div>
          </div>
          <div className="content-table">
            {
              ranking.length > 0 ? (
                ranking.map(rankingUser => (
                  <div key={rankingUser.nickname} 
                  className={
                    rankingUser.nickname === user.user.nickname ? (
                      rankingUser.position % 2 === 0 ? "table-row table-row--blue table-row--current-user" : "table-row table-row--current-user" 
                    ) : (
                      rankingUser.position % 2 === 0 ? "table-row table-row--blue" : "table-row" 
                    )
                  }
                  >
                    <div className="container">
                      <span className="table-row__classification">{rankingUser.position}</span>
                    </div>
                    <div className="user-container">
                      <div className="table-row__img"></div>
                      <span className="table-row__nickname">{rankingUser.nickname}</span>
                    </div>
                    <div className="container">
                      <span className="table-row__points">{rankingUser.points} <PiCoinVerticalFill /></span>
                    </div>
                  </div>
                ))
              ) : (
                <LoadingAnimation />
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}
