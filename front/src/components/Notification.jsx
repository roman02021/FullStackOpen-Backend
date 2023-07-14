const Notification = ({ message, messageType }) => {
    if (message === null) {
        return null;
    }
    const styles = {
        color: "green",
    };
    if (messageType === "error") {
        styles.color = "red";
    }
    return (
        <div className="notification" style={styles}>
            {message}
        </div>
    );
};

export default Notification;
