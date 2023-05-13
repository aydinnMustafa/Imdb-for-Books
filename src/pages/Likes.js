import React, { useState } from 'react';
import { useSelector } from "react-redux";
import { selectLikes } from "../features/likesSlice";
import BookItem from '../Components/BookItem';;



function LikesPage() {
  const [favoriteCards, setFavoriteCards] = useState([]);
  
  const likes = useSelector(selectLikes);
console.log(likes);
  return (
    <div>
      <h1>Liked Cards</h1>
      {favoriteCards.length > 0 ? (
        favoriteCards.map((card) => (
          <BookItem
            key={card.id}
            name={card.name}
            author={card.author}
            description={card.description}
            imageUrl={card.imageUrl}
            isFavorite={card.isFavorite}
          />
        ))
      ) : (
        <p>No liked cards yet.</p>
      )}
    </div>
  );
}


export default LikesPage;