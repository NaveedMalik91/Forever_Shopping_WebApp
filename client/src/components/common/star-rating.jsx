// File: src/components/common/star-rating.jsx
import { StarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function StarRatingComponent({ rating, handleRatingChange, alreadyRated }) {
  const onStarClick = (star) => {
    if (alreadyRated) {
      toast.error("You have already rated this product!");
      return;
    }

    if (handleRatingChange) handleRatingChange(star);
  };

  return (
    <div className="flex gap-1"> {/* <-- horizontal container */}
      {[1, 2, 3, 4, 5].map((star) => (
        <Button
          key={star}
          className={`p-2 rounded-full transition-colors ${
            star <= rating
              ? "text-yellow-500 hover:bg-black"
              : "text-black hover:bg-primary hover:text-primary-foreground"
          }`}
          variant="outline"
          size="icon"
          onClick={() => onStarClick(star)}
        >
          <StarIcon
            className={`w-6 h-6 ${star <= rating ? "fill-yellow-500" : "fill-black"}`}
          />
        </Button>
      ))}
    </div>
  );
}

export default StarRatingComponent;
