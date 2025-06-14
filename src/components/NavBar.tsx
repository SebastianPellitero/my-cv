import Link from "next/link";

export default function NavBar() {
  return (
   <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-orbitron text-xl font-bold text-blue-600">
            Sebastian Pellitero
          </Link>

          <ul className="hidden md:flex space-x-6">
            <li>
              <Link href="/about" className="text-gray-700 hover:text-blue-600">
                About Me
              </Link>
            </li>
            <li>
              <Link href="/projects" className="text-gray-700 hover:text-blue-600">
                Projects
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}