import csharp from "../assets/c-sharp.png";
import c from "../assets/c.png";
import css from "../assets/css.png";
import haskell from "../assets/haskell.png";
import html from "../assets/html.png";
import java from  "../assets/java.png";
import javascript from "../assets/javascript.png";
import mysql from "../assets/mysql.png";
import postgres from "../assets/postgres.png";
import python from  "../assets/python.png";

const images = {
    "csharp" : csharp,
    "c" : c,
    "css" : css,
    "haskell" : haskell,
    "html" : html,
    "java" : java,
    "javascript" : javascript,
    "mysql" : mysql,
    "postgres" : postgres,
    "python" : python,
}


export function imageResolve(name){
    return images[name];
}