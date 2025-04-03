import React from "react"
import {render,screen} from "@testing-library/react"
import Footer from "../../component/Footer"


describe("Footer Component",()=>{
    test("render footer text correctly",()=>{
    render(<Footer/>)
    const footerText=screen.getByText(/© 2025 Employee Payroll System\. All rights reserved\./i)
    expect(footerText).toBeInTheDocument();
      })
})