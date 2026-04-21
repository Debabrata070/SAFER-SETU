 import { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async () => {
    await registerUser(form);
    alert("Registered Successfully");
    navigate("/login");
  };

  return (
    <> 
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-sky-100">

      <div className="p-4 max-w-md mx-auto flex flex-col border border-blue-100 rounded-xl bg-white/90 backdrop-blur-sm shadow-xl card-hover-lift">

      <div className="item-center ml-27">
        <svg
      width="160"
      height="50"
      viewBox="0 0 160 50"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Icon */}
      <g transform="translate(0,5)">
        <circle cx="25" cy="20" r="18" fill="#3B82F6" />

        <path
          d="M5 28 C18 5, 32 5, 45 20"
          stroke="white"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />

        <polygon
          points="28,10 42,16 28,20 32,26 24,20 12,22"
          fill="white"
        />
      </g>

      {/* Text */}
      <text
        x="50"
        y="31"
        fontFamily="Poppins, Arial, sans-serif"
        fontSize="20"
        fontWeight="600"
        fill="#3B82F6"
        display="flex"
      >
      
      </text>
       </svg>  
     </div>
      <div className="mt-2 ml-10 font-serif w-full  ">
        <p className="text-xl text-graw-400 w-[100%]">Welcome To SafarSetu</p>
       </div>
      
      <h2 className="text-xl font-bold mb-4 ml-24">Register</h2>
       <span className="font-semibold text-gray-500">Name:</span>
      <input placeholder="Name"
        onChange={(e)=>setForm({...form, name:e.target.value})}
        className="border p-2 w-full mb-2 border-gray-300 rounded-lg"/>
      <span className="font-semibold text-gray-500">Email:</span>
      <input placeholder="Email"
        onChange={(e)=>setForm({...form, email:e.target.value})}
        className="border p-2 w-full mb-2 border-gray-300 rounded-lg"/>
        <span className="font-semibold text-gray-500">Password:</span>
      <input type="password" placeholder="Password"
        onChange={(e)=>setForm({...form, password:e.target.value})}
        className="border p-2 w-full mb-2 border-gray-300 rounded-lg"/>

      <button onClick={handleSubmit}
        className="success-btn text-white w-full rounded-lg cursor-pointer">
        Register
      </button>
    </div>
    </div>
    
    </>
    
  );
}

export default Register;
