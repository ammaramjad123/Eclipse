import React from "react";
import ErrorMsg from "../common/error-msg";
import { useGetShowCategoryQuery } from "@/redux/features/categoryApi";
import { useRouter } from "next/router";
import ShopCategoryLoader from "../loader/shop/shop-category-loader";

const ShopCategoryArea = () => {
  const { data: categories, isLoading, isError } = useGetShowCategoryQuery();
  const router = useRouter();

    // ✅ Display Name Mapping (Updated)
  const getDisplayName = (name) => {
    const rename = {
      "Headphones": "Formal Shirts",
      "Mobile Tablets": "T-Shirts",
      "CPU Heat Pipes": "Polo Shirts",
      "Smart Watch": "Hoodies & Sweatshirts",
      "Bluetooth": "Blazers & Suits",
      "Clothing": "Jackets",
      "Bags": "Jeans",
      "Shoes": "Trousers & Chinos",
      "Discover Skincare": "Sneakers",
      "Beauty of Skin": "Formal Shoes",
      "Awesome Lip Care": "Belts",
      "Facial Care": "Wallets",
      "Bracelets": "Watches",
      "Earrings": "Sunglasses",
      "Necklaces": "Perfumes & Body Sprays",
    };
    return rename[name] || name;
  };


  // handle category route
  const handleCategoryRoute = (title) => {
    router.push(
      `/shop?category=${title
        .toLowerCase()
        .replace("&", "")
        .split(" ")
        .join("-")}`
    );
  };

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <ShopCategoryLoader loading={isLoading} />;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && categories?.result?.length === 0) {
    content = <ErrorMsg msg="No Category found!" />;
  }
  if (!isLoading && !isError && categories?.result?.length > 0) {
    const category_items = categories.result;
    content = category_items.map((item) => (
      <div key={item._id} className="col-lg-3 col-sm-6">
        <div
          className="tp-category-main-box mb-25 p-relative fix"
          style={{ backgroundColor: "#F3F5F7" }}
        >
          <div className="tp-category-main-content">
            <h3
              className="tp-category-main-title pb-1"
              onClick={() => handleCategoryRoute(item.parent)}
            >
              {/* ✅ Only display name changed here */}
              <a className="cursor-pointer">{getDisplayName(item.parent)}</a>
            </h3>
            <span className="tp-category-main-item">
              {item.products.length} Products
            </span>
          </div>
        </div>
      </div>
    ));
  }
  return (
    <>
      <section className="tp-category-area pb-120">
        <div className="container">
          <div className="row">{content}</div>
        </div>
      </section>
    </>
  );
};

export default ShopCategoryArea;
