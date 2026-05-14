"use client";

import {

  useEffect,

  useRef,

  useState,

} from "react";

import toast
from "react-hot-toast";

import {
  useRouter,
} from "next/navigation";

interface Product {

  _id?: string;

  title: string;

  description: string;

  price: number;

  category: string;

  thumbnail: string;

  previewVideo?: string;

  fileUrl: string;

}

export default function AdminPage() {

  const router =
    useRouter();

  const audioRef =
    useRef<HTMLAudioElement | null>(
      null
    );

  const [products,
    setProducts] =
    useState<Product[]>([]);

  const [loading,
    setLoading] =
    useState(false);

  const [uploading,
    setUploading] =
    useState(false);

  const [dragging,
    setDragging] =
    useState(false);

  const [editingProduct,
    setEditingProduct] =
    useState<any>(null);

  // Form
  const [title,
    setTitle] =
    useState("");

  const [description,
    setDescription] =
    useState("");

  const [price,
    setPrice] =
    useState("");

  const [category,
    setCategory] =
    useState("");

  const [thumbnail,
    setThumbnail] =
    useState<File | null>(
      null
    );

  const [previewVideo,
    setPreviewVideo] =
    useState<File | null>(
      null
    );

  const [fileUrl,
    setFileUrl] =
    useState("");

  // Fetch Products
  useEffect(() => {

    fetchProducts();

  }, []);

  // Fetch Products
  const fetchProducts =
    async () => {

      try {

        const res =
          await fetch(
            "/api/get-products"
          );

        const data =
          await res.json();

        if (
          data.products
        ) {

          setProducts(
            data.products
          );

        }

      } catch (error) {

        console.log(error);

      }

    };

  // Upload To Cloudinary
  const uploadToCloudinary =
    async (
      file: File
    ) => {

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      formData.append(

        "upload_preset",

        process.env
          .NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
          ""

      );

      const res =
        await fetch(

          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,

          {

            method:
              "POST",

            body: formData,

          }

        );

      const data =
        await res.json();

      return data.secure_url;

    };

  // Add Product
  const handleUpload =
    async () => {

      try {

        if (

          !title ||

          !description ||

          !price ||

          !category ||

          !thumbnail ||

          !fileUrl

        ) {

          toast.error(
            "Fill all fields"
          );

          return;

        }

        setUploading(true);

        const token =
          localStorage.getItem(
            "token"
          );

        // Upload Thumbnail
        const thumbnailUrl =

          await uploadToCloudinary(
            thumbnail
          );

        // Upload Preview Video
        let previewUrl = "";

        if (
          previewVideo
        ) {

          previewUrl =

            await uploadToCloudinary(
              previewVideo
            );

        }

        // Save Product
        const res =
          await fetch(

            "/api/admin/add-product",

            {

              method:
                "POST",

              headers: {

                "Content-Type":
                  "application/json",

                authorization:
                  `Bearer ${token}`,

              },

              body: JSON.stringify({

                title,

                description,

                price,

                category,

                thumbnail:
                  thumbnailUrl,

                previewVideo:
                  previewUrl,

                fileUrl,

              }),

            }

          );

        const data =
          await res.json();

        if (
          data.success
        ) {

          toast.success(
            "Product uploaded 😄"
          );

          setTitle("");

          setDescription("");

          setPrice("");

          setCategory("");

          setThumbnail(
            null
          );

          setPreviewVideo(
            null
          );

          setFileUrl("");

          fetchProducts();

        } else {

          toast.error(
            data.message
          );

        }

        setUploading(false);

      } catch (error) {

        console.log(error);

        setUploading(false);

      }

    };

  // Delete Product
  const handleDelete =
    async (
      productId: string
    ) => {

      try {

        const confirmDelete =
          confirm(

            "Delete product?"
          );

        if (
          !confirmDelete
        ) return;

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await fetch(

            "/api/admin/delete-product",

            {

              method:
                "POST",

              headers: {

                "Content-Type":
                  "application/json",

                authorization:
                  `Bearer ${token}`,

              },

              body: JSON.stringify({

                productId,

              }),

            }

          );

        const data =
          await res.json();

        if (
          data.success
        ) {

          toast.success(
            "Deleted 😄"
          );

          setProducts(

            products.filter(
              (p) =>

                p._id !==
                productId

            )

          );

        }

      } catch (error) {

        console.log(error);

      }

    };

  // Save Edit
  const saveEdit =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await fetch(

            "/api/admin/update-product",

            {

              method:
                "POST",

              headers: {

                "Content-Type":
                  "application/json",

                authorization:
                  `Bearer ${token}`,

              },

              body: JSON.stringify({

                ...editingProduct,

                productId:
                  editingProduct._id,

              }),

            }

          );

        const data =
          await res.json();

        if (
          data.success
        ) {

          toast.success(
            "Updated 😄"
          );

          setProducts(

            products.map(
              (p) =>

                p._id ===
                editingProduct._id

                  ? data.product

                  : p

            )

          );

          setEditingProduct(
            null
          );

        }

      } catch (error) {

        console.log(error);

      }

    };

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#020617] text-white px-6 py-10 relative overflow-hidden">

      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">

        <div className="absolute top-10 left-10 w-[350px] h-[350px] bg-blue-500/20 blur-[120px] rounded-full animate-pulse"></div>

        <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-purple-500/20 blur-[120px] rounded-full animate-pulse"></div>

      </div>

      {/* Music */}
      <audio
        ref={audioRef}
        autoPlay
        loop
        hidden
      >

        <source
          src="/lofi.mp3"
          type="audio/mpeg"
        />

      </audio>

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-14">

          <div>

            <h1 className="text-5xl font-black mb-3">

              Admin Dashboard 🚀

            </h1>

            <p className="text-gray-400 text-lg">

              Manage your marketplace products

            </p>

          </div>

          <button
            onClick={() =>
              router.push("/")
            }
            className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-200 font-bold"
          >

            Go Home

          </button>

        </div>

        {/* Upload Box */}
        <div
          onDragOver={(e) => {

            e.preventDefault();

            setDragging(true);

          }}
          onDragLeave={() =>
            setDragging(false)
          }
          onDrop={(e) => {

            e.preventDefault();

            setDragging(false);

            if (
              e.dataTransfer.files[0]
            ) {

              setThumbnail(

                e.dataTransfer
                  .files[0]

              );

            }

          }}
          className={`border rounded-[35px] p-8 mb-16 backdrop-blur-xl transition-all duration-300

          ${
            dragging

              ? "border-blue-500 bg-blue-500/10"

              : "border-white/10 bg-white/5"

          }`}
        >

          <h2 className="text-3xl font-black mb-8">

            Upload Product ✨

          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <input
              type="text"
              placeholder="Product title"
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              className="p-4 rounded-2xl bg-black/30 border border-white/10 outline-none"
            />

            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) =>
                setPrice(
                  e.target.value
                )
              }
              className="p-4 rounded-2xl bg-black/30 border border-white/10 outline-none"
            />

            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
              className="p-4 rounded-2xl bg-black/30 border border-white/10 outline-none"
            />

            <input
              type="text"
              placeholder="Download File URL"
              value={fileUrl}
              onChange={(e) =>
                setFileUrl(
                  e.target.value
                )
              }
              className="p-4 rounded-2xl bg-black/30 border border-white/10 outline-none"
            />

          </div>

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            className="w-full h-40 mt-6 p-4 rounded-2xl bg-black/30 border border-white/10 outline-none"
          />

          {/* Uploads */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">

            <div className="bg-black/30 border border-white/10 rounded-3xl p-6">

              <p className="mb-4 font-semibold">

                Upload Thumbnail 🖼️

              </p>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setThumbnail(

                    e.target
                      .files?.[0] ||

                      null

                  )
                }
              />

            </div>

            <div className="bg-black/30 border border-white/10 rounded-3xl p-6">

              <p className="mb-4 font-semibold">

                Upload Preview Video 🎬

              </p>

              <input
                type="file"
                accept="video/*"
                onChange={(e) =>
                  setPreviewVideo(

                    e.target
                      .files?.[0] ||

                      null

                  )
                }
              />

            </div>

          </div>

          {/* Preview */}
          {thumbnail && (

            <img
              src={URL.createObjectURL(
                thumbnail
              )}
              className="w-48 h-48 object-cover rounded-3xl mt-8 border border-white/10"
            />

          )}

          {/* Upload Button */}
          <button
            onClick={
              handleUpload
            }
            disabled={uploading}
            className="mt-10 px-10 py-5 rounded-3xl bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-200 text-xl font-black"
          >

            {uploading

              ? "Uploading..."

              : "Upload Product 🚀"}

          </button>

        </div>

        {/* Product List */}
        <div>

          <h2 className="text-4xl font-black mb-10">

            All Products 🔥

          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

            {products.map(
              (item) => (

                <div
                  key={item._id}
                  className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[35px] overflow-hidden hover:scale-[1.02] transition-all duration-300"
                >

                  <img
                    src={
                      item.thumbnail
                    }
                    alt={
                      item.title
                    }
                    className="w-full h-64 object-cover"
                  />

                  <div className="p-6">

                    <div className="flex justify-between items-center mb-4">

                      <span className="px-4 py-2 rounded-full bg-blue-600 text-sm">

                        {
                          item.category
                        }

                      </span>

                      <span className="text-2xl font-black text-blue-400">

                        ₹
                        {
                          item.price
                        }

                      </span>

                    </div>

                    <h3 className="text-2xl font-black mb-4 line-clamp-2">

                      {
                        item.title
                      }

                    </h3>

                    <p className="text-gray-300 line-clamp-3 mb-6">

                      {
                        item.description
                      }

                    </p>

                    <div className="flex flex-col gap-4">

                      <button
                        onClick={() =>
                          setEditingProduct(
                            item
                          )
                        }
                        className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-200 font-bold"
                      >

                        Edit Product

                      </button>

                      <button
                        onClick={() =>
                          handleDelete(

                            item._id ||

                            ""

                          )
                        }
                        className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-95 transition-all duration-200 font-bold"
                      >

                        Delete Product

                      </button>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        </div>

        {/* Edit Modal */}
        {editingProduct && (

          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-5">

            <div className="bg-[#111827] border border-white/10 rounded-[35px] p-8 w-full max-w-2xl">

              <h2 className="text-3xl font-black mb-6">

                Edit Product ✨

              </h2>

              <input
                type="text"
                value={
                  editingProduct.title
                }
                onChange={(e) =>
                  setEditingProduct({

                    ...editingProduct,

                    title:
                      e.target.value,

                  })
                }
                className="w-full p-4 rounded-2xl bg-black/30 border border-white/10 outline-none mb-4"
              />

              <textarea
                value={
                  editingProduct.description
                }
                onChange={(e) =>
                  setEditingProduct({

                    ...editingProduct,

                    description:
                      e.target.value,

                  })
                }
                className="w-full h-36 p-4 rounded-2xl bg-black/30 border border-white/10 outline-none mb-4"
              />

              <input
                type="number"
                value={
                  editingProduct.price
                }
                onChange={(e) =>
                  setEditingProduct({

                    ...editingProduct,

                    price:
                      e.target.value,

                  })
                }
                className="w-full p-4 rounded-2xl bg-black/30 border border-white/10 outline-none mb-4"
              />

              <input
                type="text"
                value={
                  editingProduct.category
                }
                onChange={(e) =>
                  setEditingProduct({

                    ...editingProduct,

                    category:
                      e.target.value,

                  })
                }
                className="w-full p-4 rounded-2xl bg-black/30 border border-white/10 outline-none mb-6"
              />

              <div className="flex gap-4">

                <button
                  onClick={() =>
                    setEditingProduct(
                      null
                    )
                  }
                  className="flex-1 py-4 rounded-2xl bg-gray-700 hover:bg-gray-800 active:scale-95 transition-all duration-200 font-bold"
                >

                  Cancel

                </button>

                <button
                  onClick={
                    saveEdit
                  }
                  className="flex-1 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-200 font-bold"
                >

                  Save Changes

                </button>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>

  );

}