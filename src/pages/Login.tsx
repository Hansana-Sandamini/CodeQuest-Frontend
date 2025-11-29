import { useState } from "react"
import { useDispatch } from "react-redux"
import { loginUserAction } from "../features/auth/authActions"
import type { AppDispatch } from "../store/store"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await dispatch(loginUserAction({ email, password }))

    if (loginUserAction.fulfilled.match(res)) {
      navigate("/profile")
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      <form onSubmit={submitHandler} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-blue-600 text-white py-2 rounded mt-2 hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  )
}

export default Login
