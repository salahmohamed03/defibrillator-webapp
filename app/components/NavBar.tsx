"use client";

import Link from "next/link";
import styles from "./NavBar.module.css";

export default function NavBar(){
    
    return (
        <>
        <div className={styles.mainDiv}>
          <Link href="/" className={styles.linkButton}>Home</Link>
          <Link href="/instructions" className={styles.linkButton}>Instructions</Link>
        </div>
      </>
    )
}