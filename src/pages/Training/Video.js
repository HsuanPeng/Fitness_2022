import styled from 'styled-components';

const Video = (props) => {
  // ＝＝＝＝＝＝＝＝＝＝關閉影片＝＝＝＝＝＝＝＝＝＝＝

  function closeVideo() {
    props.setVideoShow(false);
  }

  // ＝＝＝＝＝＝＝＝＝＝關閉影片＝＝＝＝＝＝＝＝＝＝＝

  return (
    <VideoZone $isHide={props.videoShow}>
      <Close onClick={closeVideo}>X</Close>
      <video autoPlay loop width={640} controls src={props.videoUrl}></video>
    </VideoZone>
  );
};

export default Video;

const VideoZone = styled.div`
  display: ${(props) => (props.$isHide ? 'block;' : 'none;')};
  position: fixed;
  background: #ffe4b5;
  padding: 30px;
  border-radius: 3%;
`;

const Close = styled.div``;
