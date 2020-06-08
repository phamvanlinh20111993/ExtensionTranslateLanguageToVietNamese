
 import {
     AnalysisAutoTextImage
 } from './AnalysisAutoTextImage.js';

 import {
     ENGLISH_TYPE,
     VIETNAMESE_TYPE
 } from '../Helper.js';

 function getAnalysisImageInstance(imageUrl){
     return new AnalysisAutoTextImage(imageUrl);
 }


 export {
     getAnalysisImageInstance
 }