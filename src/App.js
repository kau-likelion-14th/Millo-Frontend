import React from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import MainPage from './pages/MainPage/Mainpage';
import LoginPage from './pages/MainPage/LoginPage/Loginpage';
import FriendPage from './pages/MainPage/FriendPage/FriendPage';
import FriendDetailPage from './pages/MainPage/FriendPage/FriendDetailPage';
import MyPage from './pages/MainPage/MyPage/MyPage';
import { Routes, Route, useLocation } from 'react-router-dom';

// App 컴포넌트: 앱 전체의 최상위 컴포넌트
// URL 경로에 따라 어떤 페이지 컴포넌트를 렌더링할지 결정하는 라우팅을 담당한다.
function App() {
  // useLocation: 현재 브라우저의 URL 정보를 가져오는 React Router 훅
  // location.pathname으로 현재 경로를 확인할 수 있다.
  const location = useLocation();

  // isLoginPage: 현재 경로가 /login인지 확인하는 변수
  // true이면 Header와 Footer를 렌더링하지 않아 로그인 페이지에서는 네비게이션이 숨겨진다.
  const isLoginPage = location.pathname === '/login';

  return (
    <div>
      {/* isLoginPage가 false일 때만 Header 렌더링 */}
      {!isLoginPage && <Header />}

      {/* Routes: 현재 URL 경로와 일치하는 Route 하나를 찾아 해당 element를 렌더링한다.
          경로가 바뀔 때마다 아래 Route 중 매칭되는 컴포넌트로 화면이 교체된다. */}
      <Routes>
        {/* / 경로: 메인 페이지 */}
        <Route path="/" element={<MainPage />} />

        {/* /login 경로: 로그인 페이지 */}
        <Route path="/login" element={<LoginPage />} />

        {/* /friends 경로: 친구 목록 페이지
            FriendList에서 친구 항목 클릭 시 아래 /friends/:id로 이동한다. */}
        <Route path="/friends" element={<FriendPage />} />

        {/* /friends/:id 경로: 친구 상세 페이지
            :id는 동적 파라미터로, FriendList에서 navigate로 전달한 friend.id 값이 들어온다. */}
        <Route path="/friends/:id" element={<FriendDetailPage />} />

        {/* /mypage 경로: 마이 페이지 */}
        <Route path="/mypage" element={<MyPage />} />
      </Routes>

      {/* isLoginPage가 false일 때만 Footer 렌더링 */}
      {!isLoginPage && <Footer />}
    </div>
  );
}

export default App;