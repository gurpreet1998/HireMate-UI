import React from "react";
import "./CatCard.scss";

function CatCard({ card, onClick }) {
  const handleCategoryClick = () => {
    onClick(card.cat);
  };
  return (
    <div className="catCard" onClick={handleCategoryClick}>
      <img src={card.img} alt="" />
      <span className="desc">{card.desc}</span>
      <span className="title">{card.title}</span>
    </div>
  );
}
export default CatCard;
