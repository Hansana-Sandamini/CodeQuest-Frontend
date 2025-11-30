import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const MySwal = withReactContent(Swal)

const baseTheme = {
    background: "#111827",
    color: "#ffffff",
    customClass: {
    popup: "rounded-3xl border border-gray-700 shadow-2xl backdrop-blur-md",
    title: "text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent",
    confirmButton:
        "px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all shadow-lg",
    },
    buttonsStyling: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    heightAuto: false,
}

const swal = MySwal.mixin(baseTheme)

export const handleAuthAction = async (
    asyncThunkAction: () => Promise<any>,
    {
        loadingText = "Please wait...",
        successTitle = "Success!",
        successText,
        navigateTo,
        navigate,
    }: {
        loadingText?: string
        successTitle?: string
        successText: string
        navigateTo: string
        navigate: (path: string) => void
    }
    ) => {
        swal.fire({
        title: loadingText,
        didOpen: () => {
            swal.showLoading()
        },
    })

    try {
        const resultAction = await asyncThunkAction()

        swal.close()

        if ((resultAction as any).type?.endsWith("/fulfilled")) {
            await swal.fire({
                icon: "success",
                title: successTitle,
                text: successText,
                timer: 2000,
                showConfirmButton: false,
            })
            navigate(navigateTo)
            return true
        }

        // Error from backend
        const errorMessage =
            (resultAction.payload as any)?.message ||
            (resultAction.error as any)?.message ||
            "Something went wrong"

        await swal.fire({
            icon: "error",
            title: "Oops...",
            text: errorMessage,
        })
        return false
        
    } catch (err: any) {
        swal.close()
        await swal.fire({
            icon: "error",
            title: "Connection failed",
            text: "Please check your internet connection",
        })
        return false
    }
}

export default swal
