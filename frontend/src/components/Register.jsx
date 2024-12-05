import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
    address: {
      fullName: "",
      phone: "",
      addressLine: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData({
        ...formData,
        address: { ...formData.address, [addressField]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.cpassword) {
      alert("Passwords do not match.");
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      address: { ...formData.address },
    };

    dispatch(registerUser(payload))
      .unwrap()
      .then(() => {
        navigate("/login");
      })
      .catch((err) => {
        console.error("Registration failed:", err);
      });
  };
  const handleNavigation = () => {
    navigate("/login");
  };

  return (
    <div className="w-full h-full bg-gray-100 font-[sans-serif]">
      <div className="max-w-4xl mx-auto font-[sans-serif] p-6">
        <div className="text-center mb-8">
          {error && <p className="text-red-500">{error}</p>}
          <img
            src={"/icons/trolley.png"}
            alt="logo"
            className="w-40 mb-8 mx-auto block object-cover"
          />
          <h4 className="text-gray-800 text-base font-semibold mt-6">
            Sign up into your account
          </h4>
        </div>

        <form onSubmit={handleSubmit} className="p-8 bg-white rounded-2xl shadow mb-10">
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <label className="text-gray-800 text-sm mb-2 block">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Full Name"
                className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Email Id
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Confirm Password
              </label>
              <input
                type="password"
                name="cpassword"
                value={formData.cpassword}
                onChange={handleInputChange}
                placeholder="Confirm Password"
                className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 gap-8">
            <div>
              <label className="text-gray-800 text-sm mb-2 block">Phone</label>
              <input
                type="text"
                name="address.phone"
                value={formData.address.phone}
                onChange={handleInputChange}
                placeholder="Phone"
                className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Address Line
              </label>
              <input
                type="text"
                name="address.addressLine"
                value={formData.address.addressLine}
                onChange={handleInputChange}
                placeholder="Address Line"
                className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="text-gray-800 text-sm mb-2 block">City</label>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleInputChange}
                placeholder="City"
                className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="text-gray-800 text-sm mb-2 block">State</label>
              <input
                type="text"
                name="address.state"
                value={formData.address.state}
                onChange={handleInputChange}
                placeholder="State"
                className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="!mt-12">
            <button
              type="submit"
              className="py-3.5 px-7 text-sm font-semibold tracking-wider rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
              Sign up
            </button>
          </div>
          <p className="text-gray-800 text-sm !mt-8 text-center">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={handleNavigation}
              className="text-blue-600 hover:underline ml-1 whitespace-nowrap font-semibold"
            >
              Sign in here
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
