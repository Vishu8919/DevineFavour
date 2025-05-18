'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaBookOpen, FaClipboardList, FaSignOutAlt, FaStore, FaUser } from "react-icons/fa"; 
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { clearCart } from "@/redux/slices/cartSlice";

const AdminSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    router.push('/');
  };

  const isActive = (path) => pathname === path;

  const linkClasses = (path) =>
    isActive(path)
      ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
      : "text-gray-300 hover:text-white py-3 px-4 rounded flex items-center space-x-2";

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href="/admin" className="text-2xl font-medium">
          Divine Favor Boutique
        </Link>
      </div>
      <h2 className="text-xl font-medium mb-6 text-center">Admin Dashboard</h2>

      <nav className="flex flex-col space-y-2">
        <Link href="/admin/users" className={linkClasses("/admin/users")}>
          <FaUser />
          <span>Users</span>
        </Link>
        <Link href="/admin/products" className={linkClasses("/admin/products")}>
          <FaBookOpen />
          <span>Products</span>
        </Link>
        <Link href="/admin/orders" className={linkClasses("/admin/orders")}>
          <FaClipboardList />
          <span>Orders</span>
        </Link>
        <Link href="/" className={linkClasses("/")}>
          <FaStore />
          <span>Shop</span>
        </Link>
      </nav>

      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center justify-center space-x-2"
        >
          <FaSignOutAlt />
          <span>LogOut</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
