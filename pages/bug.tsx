import { useSession } from "next-auth/react"
import LayoutAuthenticated from "../components/layoutAuthenticated"
import { useEffect, useState } from "react";

export default function MotherboredBugReportPage() {

  return (
    <LayoutAuthenticated>
      <div className="px-12 py-12">
        <span className="font-jetbrains text-xs truncate">
          motherbored-bug-report
        </span>

        <div className="App">
        <form name="bug-report" method="POST" data-netlify="true" action="/">
        <input type="hidden" name="bug-report" value="contact" />
          <p>
            <label>
              Name: <input type="text" name="name" />
            </label>
          </p>
          <p>
            <label>
              Bug: <input type="text" name="bug" />
            </label>
          </p>
          <p>
            <button type="submit">Send</button>
          </p>
        </form>    
        </div>

      </div>
      
    </LayoutAuthenticated>
  )
}

