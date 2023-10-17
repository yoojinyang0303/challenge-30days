import { styled } from "styled-components";
import { GithubAuthProvider } from "firebase/auth";

const Button = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 100%;
  margin-top: 50px;
  padding: 10px 20px;
  border: 0;
  border-radius: 50px;
  font-weight: 500;
  color: black;
  cursor: pointer;
  background-color: white;
`;

const Logo = styled.img`
  height: 25px;
`;

export default function GithubButton() {
  const onClick = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Button onClick={onClick}>
      <Logo src="/github-logo.svg" />
      Continue with Github
    </Button>
  );
}
