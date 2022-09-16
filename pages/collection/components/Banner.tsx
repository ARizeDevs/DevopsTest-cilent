import React from "react";
import Image from "next/image";
import { StaticImageData } from "next/image";
import BaseButton from "@/components/Buttons/BaseButton/BaseButton";
import styles from "../collection.module.css";
import classes from "@/utils/classes";

interface bannerProps {
  background: string | StaticImageData;
}

const Banner = (props: bannerProps) => {
  const { background } = props;
  return (
    <div className="rounded-2xl px-4 pb-8 pt-40 lg:px-8 lg:pt-16 lg:pb-8">
      <Image src={background} className="h-full w-full" alt='Arize'/>

    </div>
  );
};

export default Banner;
