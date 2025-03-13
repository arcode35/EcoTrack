"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // 3/10 create users

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>Next App</h1>

      <div className="form-container">
        <form className="create-user-form">
          <label htmlFor="username">
            Enter your username: <br />
          </label>

          <input
            type="text"
            placeholder="username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />

          <br />
          <br />
          <label htmlFor="password">
            Enter your password: <br />
          </label>

          <input
            type="password"
            placeholder="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <br />

          <button
            type="submit"
            onClick={async (e) => {
              e.preventDefault();

              const url = "http://localhost:3001/users/create_user";
              console.log(url);
              const options = {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  username,
                  password,
                }),
              };
              try {
                const response = await fetch(url, options);
                if (!response.ok) {
                  alert("Request was unsuccessful");
                } else {
                  const data = await response.json();
                  console.log(data);
                }
              } catch (error) {
                alert(error);
              }
            }}
          >
            Submit
          </button>
        </form>

        <button
          onClick={async (e) => {
            e.preventDefault();
            const url = "http://localhost:3001/users";

            try {
              const response = await fetch(url);
              if (!response.ok) {
                alert("Retrieving users was unsuccessful");
              } else {
                const data = await response.json();
                console.log(data);
              }
            } catch (error) {
              alert(error);
            }
          }}
        >
          {" "}
          Get Users{" "}
        </button>
      </div>
    </div>
  );
}
