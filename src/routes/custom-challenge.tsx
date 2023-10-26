import {
  Outlet,
  Link,
  useNavigate,
  useLocation,
  NavLink,
} from "react-router-dom";
import { styled } from "styled-components";
import { auth } from "../firebase";
import CustomChallengeForm from "../components/custom-challenge-form";

const Wrapper = styled.div`
  width: 100%;
  padding: 30px 20px;
  overflow-y: scroll;
  background-color: white;
`;

const PageTitle = styled.h2`
  padding: 0;
  margin: 50px 0 30px 0;
  font-size: 2rem;
`;

export default function CustomChallenge() {
  return (
    <Wrapper>
      {/* 페이지 제목 */}
      <PageTitle>나만의 챌린지</PageTitle>
      <CustomChallengeForm />
    </Wrapper>
  );
}
