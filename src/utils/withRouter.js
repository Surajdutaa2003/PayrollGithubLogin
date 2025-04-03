
import { useNavigate, useLocation } from "react-router-dom";

export function withRouter(Component) {
  return function Wrapper(props) {
    const navigate = useNavigate();
    const location = useLocation();
    return <Component {...props} navigate={navigate} location={location} />;
  };
}