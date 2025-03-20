import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
function NoAccess() {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
          <p className="mt-4 text-gray-600">
            You are not assigned to any branch. Please contact the admin for assistance.
          </p>
        </div>
      </div>
    );
  }
  
  export default NoAccess;