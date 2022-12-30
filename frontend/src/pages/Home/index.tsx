import { QRIcon } from "../../components/Icon"
import "./index.css"
import logo from '/logo.svg'


export default function Home({ }) {
  return (
  <div className="home-page">
    <div className="header">URL Shortener</div>
    <br />
    <section className="section-1">
      <p>Shorten your links with a single click!</p>
      <p>With Automatically generated QR, a two in one solution.</p>
      <div className="logo-container">
        <img className="logo" src={logo} alt="Logo" />
      </div>
    </section>
  </div>)
}