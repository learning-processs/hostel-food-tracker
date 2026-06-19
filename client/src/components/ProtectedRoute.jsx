import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useContext(AuthContext);

  // Not logged in at all — send to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Logged in, but wrong role for this route — send back to login too
  // (could redirect to their own dashboard instead, but login is simpler and safe)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;