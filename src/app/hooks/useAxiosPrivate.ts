import { axiosPrivate } from "../../api/axios";

/**
 * Hook to retrieve the private axios instance.
 * Since request/response interceptors and JWT token refreshing are now handled
 * statically and globally in src/api/axios.ts, this hook simply returns the
 * singleton axiosPrivate instance to preserve backward compatibility.
 */
const useAxiosPrivate = () => {
    return axiosPrivate;
};

export default useAxiosPrivate;

