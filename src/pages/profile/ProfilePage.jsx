import './profilePage.css';
import useLogOut from '../../hooks/auth/useLogOut';




const ProfilePage = () => {

    // Custom log out hook
    const logOut = useLogOut();


    const signOut = async () => {
        // Try to log out
        await logOut();
    };

    return (
        <div>
            <button onClick={signOut}>LOG OUT</button>
        </div>
    );
};

export default ProfilePage;