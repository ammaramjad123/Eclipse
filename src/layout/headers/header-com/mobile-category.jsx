import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
// internal
import { useGetProductTypeCategoryQuery } from "@/redux/features/categoryApi";
import ErrorMsg from "@/components/common/error-msg";
import Loader from "@/components/loader/loader";

const MobileCategory = ({ isCategoryActive, categoryType }) => {
  const { data: categories, isError, isLoading } = useGetProductTypeCategoryQuery(categoryType);
  const [isActiveSubMenu, setIsActiveSubMenu] = useState("");
  const router = useRouter();

  // ✅ Rename categories and assign images/subcategories
  const renameCategory = (name) => {
    const rename = {
      "Headphones": { 
        name: "Formal Shirts", 
        img: "/assets/img/product/formal-shirts/formal-shirt-yellow-main.png", 
        children: ["Slim Fit", "Classic Fit"] 
      },
      "Mobile Tablets": { 
        name: "T-Shirts", 
        img: "/assets/img/product/tshirts/tshirt-black-main.png", 
        children: ["Round Neck", "V-Neck"] 
      },
      "CPU Heat Pipes": { 
        name: "Polo Shirts", 
        img: "/assets/img/product/polo-shirts/polo-shirt-navy-main.png", 
        children: ["Casual", "Sport"] 
      },
      "Smart Watch": { 
        name: "Hoodies & Sweatshirts", 
        img: "/assets/img/product/hoodies/hoodie-black-main.png", 
        children: ["Zipper", "Pullover"] 
      },
      "Bluetooth": { 
        name: "Blazers & Suits", 
        img: "/assets/img/product/blazers-suits/blazer-blue-main.png", 
        children: ["Two-Piece", "Three-Piece"] 
      },
      "Clothing": { 
        name: "Jackets", 
        img: "/assets/img/product/jackets/jacket-brown-main.png", 
        children: ["Winter", "Bomber"] 
      },
      "Bags": { 
        name: "Jeans", 
        img: "/assets/img/product/jeans/jeans-blue-main.png", 
        children: ["Slim Fit", "Straight Fit"] 
      },
      "Shoes": { 
        name: "Trousers & Chinos", 
        img: "/assets/img/product/trousers-chinos/trouser-cream-main.png", 
        children: ["Formal", "Casual"] 
      },
      "Discover Skincare": { 
        name: "Sneakers", 
        img: "/assets/img/product/mobilepics/1.png", 
        children: ["High Top", "Low Top"] 
      },
      "Beauty of Skin": { 
        name: "Formal Shoes", 
        img: "/assets/img/product/mobilepics/2.png", 
        children: ["Oxford", "Derby"] 
      },
      "Awesome Lip Care": { 
        name: "Belts", 
        img: "/assets/img/product/mobilepics/3.png", 
        children: ["Leather", "Canvas"] 
      },
      "Facial Care": { 
        name: "Wallets", 
        img: "/assets/img/product/mobilepics/4.png", 
        children: ["Leather", "Slim"] 
      },
      "Bracelets": { 
        name: "Watches", 
        img: "/assets/img/product/watches/watch-black-main.png", 
        children: ["Analog", "Smart"] 
      },
      "Earrings": { 
        name: "Sunglasses", 
        img: "/assets/img/product/sunglasses/sunglass-black-main.png", 
        children: ["Round", "Square"] 
      },
      "Necklaces": { 
        name: "Perfumes & Body Sprays", 
        img: "/assets/img/product/perfumes/perfume-main.png", 
        children: ["Perfumes", "Body Sprays"] 
      },
    };

    // ✅ Fixed fallback sequence (not random)
    const fallbackImages = [
      { name: "Sneakers", img: "/assets/img/product/mobilepics/2.png" },
      { name: "Belts", img: "/assets/img/product/mobilepics/1.png" },
      { name: "Formal Shoes", img: "/assets/img/product/mobilepics/3.png" },
      { name: "Wallets", img: "/assets/img/product/mobilepics/4.png" },
    ];

    // Normalize and find match
    const key = name?.trim();
    const renamed = rename[key];

    // ✅ Determine fallback index based on category index
    const index = Math.min(
      categories?.result?.findIndex((item) => item.parent === name) ?? 0,
      fallbackImages.length - 1
    );

    const fallback = fallbackImages[index] || fallbackImages[0];

    return {
      name: renamed?.name || fallback.name,
      img: renamed?.img || fallback.img,
      children: renamed?.children || [],
    };
  };

 

  // handle sub menu toggle
  const handleOpenSubMenu = (title) => {
    setIsActiveSubMenu(isActiveSubMenu === title ? "" : title);
  };

  // handle category route
  const handleCategoryRoute = (title, route) => {
    if (route === "parent") {
      router.push(
        `/shop?category=${title
          .toLowerCase()
          .replace("&", "")
          .split(" ")
          .join("-")}`
      );
    } else {
      router.push(
        `/shop?subCategory=${title
          .toLowerCase()
          .replace("&", "")
          .split(" ")
          .join("-")}`
      );
    }
  };

  // render state
  let content = null;

  if (isLoading) {
    content = (
      <div className="py-5">
        <Loader loading={isLoading} />
      </div>
    );
  } else if (isError) {
    content = <ErrorMsg msg="There was an error" />;
  } else if (categories?.result?.length === 0) {
    content = <ErrorMsg msg="No Category found!" />;
  } else if (categories?.result?.length > 0) {
    const category_items = categories.result;

    content = category_items.map((item) => {
      const renamed = renameCategory(item.parent);
      return (
        <li className="has-dropdown" key={item._id}>
          <a
            className="cursor-pointer"
            onClick={() => handleCategoryRoute(renamed.name, "parent")}
          >
            {renamed.img && (
              <span className="mr-10">
                <Image
                  src={renamed.img}
                  alt={renamed.name}
                  width={50}
                  height={50}
                  style={{ borderRadius: "6px", objectFit: "cover" }}
                />
              </span>
            )}
            {renamed.name}
            {renamed.children?.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenSubMenu(renamed.name);
                }}
                className="dropdown-toggle-btn"
              >
                <i className="fa-regular fa-angle-right"></i>
              </button>
            )}
          </a>

          {renamed.children?.length > 0 && (
            <ul
              className={`tp-submenu ${
                isActiveSubMenu === renamed.name ? "active" : ""
              }`}
            >
              {renamed.children.map((child, i) => (
                <li
                  key={i}
                  onClick={() => handleCategoryRoute(child, "children")}
                >
                  <a className="cursor-pointer">{child}</a>
                </li>
              ))}
            </ul>
          )}
        </li>
      );
    });
  }

  return <ul className={isCategoryActive ? "active" : ""}>{content}</ul>;
};

export default MobileCategory;
