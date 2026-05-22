import { useCart } from "../../features/cart/useCart";
import { useNavigate } from "react-router-dom";
import ratingIcon from "../../assets/rating.svg";
import "./ProductCard.scss";

export function ProductCard({ item }) {
  const { addItem } = useCart();
  const navigate = useNavigate();

  const openDish = () => {
    navigate(`/dish/${item.id}`, { state: { dish: item } });
  };

  const handleAdd = (event) => {
    event.stopPropagation();
    addItem(item);
  };

  return (
    <article className="product-card cursor-pointer" onClick={openDish}>
      <div
        className="product-card__image"
        style={{ backgroundImage: `url(${item.imageUrl})` }}
      />

      <div className="product-card__backdrop" />

      <div className="product-card__price">{item.price} $</div>

      {/* 2. Возвращаем твою кнопку добавления с Tailwind-классами, чтобы она не потеряла дизайн */}
      <button
        type="button"
        onClick={handleAdd}
        className="absolute left-6 top-[23px] z-10 flex h-10 items-center justify-center rounded-full bg-white px-5 text-sm font-medium text-[#0D1A2D] shadow-sm transition hover:bg-[#E9EE5D]"
      >
        Add
      </button>

      {/* 3. Оставляем BEM-классы контента из ветки master */}
      <div className="product-card__body">
        <h3 className="product-card__title">{item.title}</h3>

        <div className="product-card__meta">
          <span>{item.category}</span>
          <span className="product-card__divider">|</span>
          <span>{item.weight}</span>
          <span className="product-card__divider">|</span>
          <span>{item.calories}</span>
        </div>

        <div className="product-card__rating">
          <img
            src={ratingIcon}
            alt=""
            aria-hidden="true"
            className="product-card__rating-icon"
          />
          <span>{item.rating}</span>
          <span className="product-card__divider">({item.reviews})</span>
        </div>

        <p className="product-card__description">{item.description}</p>
      </div>
    </article>
  );
}
