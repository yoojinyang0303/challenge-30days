import PostTweetForm from "../components/post-tweet-form";
import Timeline from "../components/timeline";
// import { auth } from "../firebase";
import { styled } from "styled-components";

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: 1fr 5fr;
  gap: 50px;
  overflow-y: scroll;
`;

export default function Home() {
  return (
    <Wrapper>
      <PostTweetForm />
      <Timeline />
    </Wrapper>
  );
}
