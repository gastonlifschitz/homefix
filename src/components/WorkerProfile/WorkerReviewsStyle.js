//reviews cards
import styled from 'styled-components';

export const ReviewsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  grid-gap: 16px;
  padding: 20px 50px;
  width: 100%;

  @media screen and (max-width: 1000px) {
    grid-template-columns: 1fr;
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 20px 20px;
  }
`;

export const ReviewCard = styled.div`
  background: #fff;
  display: table;
  cursor: default;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-radius: 10px;
  max-height: 340px;
  padding: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease-in-out;
  text-decoration: none;
`;

export const ReviewCardTitle = styled.h2`
  font-size: 1rem;
  margin-bottom: 10px;
  color: black;
  /* float: left; */
  width: 75%;
`;

export const ReviewDescription = styled.p`
  font-size: 1rem;
  text-align: left;
  color: black;
  margin-bottom: 10px;
  word-break: break-all;
`;

//nuevo lindo prolijo y ordenado
//contenedor de review
export const ReviewContainer = styled.div`
  display: flex;
  background: #fff;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease-in-out;

  @media screen and (max-width: 900px) {
    flex-direction: column;
  }
`;

//contenedor de imagen
export const ReviewImgDiv = styled.div`
  padding: inherit;
`;

//img
export const ReviewIcon = styled.img`
  height: auto;
  width: auto;
  max-width: 100px;
  max-height: 100px;
`;

//contenedor de nombre, comentario y rating
export const ReviewDiv = styled.div`
  flex-grow: 1;
  padding: inherit;
`;

//contenedor de nombre y menu
export const ReviewHeader = styled.div`
  display: flex;
`;

//nombre de usuario
export const ReviewName = styled.h4`
  font-size: 18;
  text-transform: uppercase;
  margin-bottom: 10px;
  flex-grow: 1;
  word-break: break-all;
`;

//rating style
export const StarsStyle = styled.div``;
