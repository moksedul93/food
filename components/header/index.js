import Cookies from 'js-cookie'

const Header = props => {

    const handleMini = e =>  {
        if(document.body.clientWidth > 1025 ) {
            if(props.layout == "sidebar-mini") {
                props.setLayout("");
                Cookies.set("sidebar", "");
            } else {
                props.setLayout("sidebar-mini");
                Cookies.set("sidebar" , "mini");
            }
        } else {
            props.layout == "sidebar-show" ? props.setLayout("sidebar-gone") : props.setLayout("sidebar-show");
        }

    }

    return (
        <>
            <div className="navbar-bg"></div>
            <nav className="navbar navbar-expand-lg main-navbar">
                <form className="form-inline mr-auto">
                    <ul className="navbar-nav mr-3">
                        <li><a onClick={handleMini} className="nav-link nav-link-lg cursor-pointer" style={{color: "#ffffff"}}><i
                            className="fas fa-bars"></i></a></li>
                    </ul>

                </form>
                <ul className="navbar-nav navbar-right">
                    {props.children}
                </ul>
            </nav>
        </>


    )
}
export default Header