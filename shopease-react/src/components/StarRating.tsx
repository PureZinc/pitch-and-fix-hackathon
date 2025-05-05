const StarRating: React.FC<{rating: number}> = ({rating}) => {
    return (
    <>
        {Array.from({ length: 5 }, (_, i) => (
            <i
                key={i}
                className={
                    i < Math.floor(rating)
                        ? "fas fa-star"
                        : i < rating
                        ? "fas fa-star-half-alt"
                        : "far fa-star"
                }
            ></i>
        ))}
    </>
    )
}

export default StarRating;