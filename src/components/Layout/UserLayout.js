'use client';

import React from 'react';
import Header from '../Common/Header';
import Footer from '../Common/Footer';

const UserLayout = ({ children }) => {
  return (
    <>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default UserLayout;
