import { useNavigate } from "react-router";

const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    return (
        <section style={{ padding: "50px", textAlign: "center" }}>
            <h1>Unauthorized</h1>
            <br />
            <p>You do not have access to the requested page.</p>
            <div style={{ marginTop: "20px" }}>
                <button
                  style={{ padding: "10px 20px", cursor: "pointer" }}
                  onClick={goBack}
                >
                    Go Back
                </button>
            </div>
        </section>
    )
}

export default Unauthorized;
