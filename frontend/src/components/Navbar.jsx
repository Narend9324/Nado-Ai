const Navbar = () => {
    return (
      <nav className="bg-gray-100 shadow-sm p-4 flex justify-between items-center">
        {/* Replace src with your local logo path */}
        <img src="/Logo.svg" alt="Logo" className="h-10" />
  
        <div className="flex items-center">
          <button className="mr-4">HPA Portal</button>
          {/* User profile icon */}
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-500">👤</span>
          </div>
        </div>
      </nav>
    );
  };

  export default Navbar