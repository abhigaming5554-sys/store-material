"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import toast from "react-hot-toast";

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

  // Admin Auth Check
  useEffect(() => {

    const token =
      localStorage.getItem(
        "token"
      );

    const adminEmail =
      localStorage.getItem(
        "adminEmail"
      );

    if (!token) {

      router.push("/login");

      return;

    }

    if (

      adminEmail !==
      process.env
        .NEXT_PUBLIC_ADMIN_EMAIL

    ) {

      toast.error(
        "Access Denied 😅"
      );

      router.push("/");

      return;

    }

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

  // Upload Product
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

      </div>

    </div>

  );

}