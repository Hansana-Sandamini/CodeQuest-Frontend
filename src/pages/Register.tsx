import { useState } from "react"
import { useDispatch } from "react-redux"
import { registerUserAction } from "../features/auth/authActions"
import type { AppDispatch } from "../store/store"

const Register = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: ""
  })
  const [profilePicture, setProfilePicture] = useState<File | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault()
    const fd = new FormData()
    Object.entries(formData).forEach(([key, value]) => fd.append(key, value))
    if (profilePicture) fd.append("profilePicture", profilePicture)

    await dispatch(registerUserAction(fd))
    alert("Registration request sent! Please login.")
  }

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-3xl mb-4 font-bold">Create Account</h1>

      <form onSubmit={submitHandler} className="grid gap-4">
        {["firstname", "lastname", "username", "email", "password"].map((key) => (
          <input
            key={key}
            type={key === "password" ? "password" : "text"}
            name={key}
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
            className="border p-2 rounded"
            value={(formData as any)[key]}
            onChange={handleChange}
          />
        ))}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
        />

        <button className="bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Register
        </button>
      </form>
    </div>
  )
}

export default Register
