import React from 'react';
import '../styles/Footer.css';
import logo from '../assets/img/logo.png';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <img src={logo} alt="logo" className="footer-logo" />
        <span className="footer-title">Lion To-do Everyday</span>
      </div>
      <p className="footer-desc"><b>LTE는 멋쟁이사자처럼에서 개발한 투두 관리 기반의 웹 서비스입니다.</b></p>
      <div className="footer-info">
        <span>상호명 멋쟁이사자처럼</span>
        <span>대표자 이재현</span>
        <span>주소 경기도 고양시 항공대학로76 항공우주센터 3층 창업카페</span>
      </div>
      <div className="footer-info">
        <span>사업자등록번호 333-22-55555</span>
        <span>개인정보보호책임자 이재현</span>
        <span>이메일 dlwogus134@gmail.com</span>
        <span>전화번호 010-5399-4593</span>
      </div>
    </footer>
  );
}

export default Footer;