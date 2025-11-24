// src/components/BodyMapWidget.jsx
import React, { useState } from "react";

const SYSTEMS = {
  neuro: {
    id: "neuro",
    name: "神經系統",
    description:
      "與腦部與神經傳導相關，包含頭暈、頭痛、癲癇、巴金森氏症等。",
    diseases: [
      {
        name: "頭暈 / 頭痛",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E9%A0%AD%E7%97%9B&#gsc.tab=0&gsc.sort=date&gsc.q=%E9%A0%AD%E7%97%9B",
      },
      {
        name: "神經異常",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E7%A5%9E%E7%B6%93%E7%95%B0%E5%B8%B8&#gsc.tab=0&gsc.sort=date&gsc.q=%E7%A5%9E%E7%B6%93%E7%95%B0%E5%B8%B8",
      },
      {
        name: "癲癇症",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E7%99%B2%E7%99%87%E7%97%87&#gsc.tab=0&gsc.sort=date&gsc.q=%E7%99%B2%E7%99%87%E7%97%87",
      },
      {
        name: "巴金森氏症",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E5%B7%B4%E9%87%91%E6%A3%AE%E6%B0%8F%E7%97%87&#gsc.tab=0&gsc.sort=date&gsc.q=%E5%B7%B4%E9%87%91%E6%A3%AE%E6%B0%8F%E7%97%87",
      },
      {
        name: "神經痛",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E7%A5%9E%E7%B6%93%E7%97%9B&#gsc.tab=0&gsc.sort=date&gsc.q=%E7%A5%9E%E7%B6%93%E7%97%9B",
      },
      {
        name: "腦中風",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E8%85%A6%E4%B8%AD%E9%A2%A8&#gsc.tab=0&gsc.sort=date&gsc.q=%E8%85%A6%E4%B8%AD%E9%A2%A8",
      },
      {
        name: "腦部病變",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E8%85%A6%E9%83%A8%E7%97%85%E8%AE%8A&#gsc.tab=0&gsc.sort=date&gsc.q=%E8%85%A6%E9%83%A8%E7%97%85%E8%AE%8A",
      },
    ],
  },

  eye: {
    id: "eye",
    name: "眼科",
    description: "負責視力與視覺相關疾病。",
    diseases: [
      {
        name: "白內障",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E7%99%BD%E5%85%A7%E9%9A%9C&#gsc.tab=0&gsc.sort=date&gsc.q=%E7%99%BD%E5%85%A7%E9%9A%9C",
      },
      {
        name: "青光眼",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E9%9D%92%E5%85%89%E7%9C%BC&#gsc.tab=0&gsc.sort=date&gsc.q=%E9%9D%92%E5%85%89%E7%9C%BC",
      },
      {
        name: "黃斑部病變",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E9%BB%83%E6%96%91%E9%83%A8%E7%97%85%E8%AE%8A&#gsc.tab=0&gsc.sort=date&gsc.q=%E9%BB%83%E6%96%91%E9%83%A8%E7%97%85%E8%AE%8A",
      },
      {
        name: "乾眼症",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E4%B9%BE%E7%9C%BC%E7%97%87&#gsc.tab=0&gsc.sort=date&gsc.q=%E4%B9%BE%E7%9C%BC%E7%97%87",
      },
      {
        name: "視力缺陷",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E8%A6%96%E5%8A%9B%E7%BC%BA%E9%99%B7&#gsc.tab=0&gsc.sort=date&gsc.q=%E8%A6%96%E5%8A%9B%E7%BC%BA%E9%99%B7",
      },
      {
        name: "結膜炎",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E7%B5%90%E8%86%9C%E7%82%8E&#gsc.tab=0&gsc.sort=date&gsc.q=%E7%B5%90%E8%86%9C%E7%82%8E",
      },
    ],
  },

  ent: {
    id: "ent",
    name: "耳鼻喉科",
    description: "耳朵、鼻腔與喉嚨相關問題。",
    diseases: [
      {
        name: "中耳炎",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E4%B8%AD%E8%80%B3%E7%82%8E&#gsc.tab=0&gsc.sort=date&gsc.q=%E4%B8%AD%E8%80%B3%E7%82%8E",
      },
      {
        name: "鼻竇炎",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E9%BC%BB%E7%AB%87%E7%82%8E&#gsc.tab=0&gsc.sort=date&gsc.q=%E9%BC%BB%E7%AB%87%E7%82%8E",
      },
      {
        name: "慢性咽喉炎",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E6%85%A2%E6%80%A7%E5%92%BD%E5%96%89%E7%82%8E&#gsc.tab=0&gsc.sort=date&gsc.q=%E6%85%A2%E6%80%A7%E5%92%BD%E5%96%89%E7%82%8E",
      },
      {
        name: "過敏性鼻炎",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E9%81%8E%E6%95%8F%E6%80%A7%E9%BC%BB%E7%82%8E&#gsc.tab=0&gsc.sort=date&gsc.q=%E9%81%8E%E6%95%8F%E6%80%A7%E9%BC%BB%E7%82%8E",
      },
      {
        name: "眩暈",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E7%9C%A9%E6%9A%88&#gsc.tab=0&gsc.sort=date&gsc.q=%E7%9C%A9%E6%9A%88",
      },
      {
        name: "扁桃腺發炎",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E6%89%81%E6%A1%83%E8%85%BA%E7%99%BC%E7%82%8E&#gsc.tab=0&gsc.sort=date&gsc.q=%E6%89%81%E6%A1%83%E8%85%BA%E7%99%BC%E7%82%8E",
      },
      {
        name: "睡眠呼吸中止症",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E7%9D%A1%E7%9C%A0%E5%91%BC%E5%90%B8%E4%B8%AD%E6%AD%A2%E7%97%87&#gsc.tab=0&gsc.sort=date&gsc.q=%E7%9D%A1%E7%9C%A0%E5%91%BC%E5%90%B8%E4%B8%AD%E6%AD%A2%E7%97%87",
      },
      {
        name: "腮腺炎",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E8%85%AE%E8%85%BA%E7%82%8E&#gsc.tab=0&gsc.sort=date&gsc.q=%E8%85%AE%E8%85%BA%E7%82%8E",
      },
      {
        name: "喉嚨痛、咳嗽",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E5%96%89%E5%9A%A8%E7%97%9B%E3%80%81%E5%92%B3%E5%97%BD&#gsc.tab=0&gsc.sort=date&gsc.q=%E5%96%89%E5%9A%A8%E7%97%9B%E3%80%81%E5%92%B3%E5%97%BD",
      },
    ],
  },

  chest: {
    id: "chest",
    name: "呼吸胸腔",
    description: "與肺部與胸腔相關疾病。",
    diseases: [
      {
        name: "氣喘",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E6%B0%A3%E5%96%98&#gsc.tab=0&gsc.sort=date&gsc.q=%E6%B0%A3%E5%96%98",
      },
      {
        name: "慢性阻塞性肺病（COPD）",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E6%85%A2%E6%80%A7%E9%98%BB%E5%A1%9E%E6%80%A7%E8%82%BA%E7%97%85%EF%BC%88COPD%EF%BC%89&#gsc.tab=0&gsc.sort=date&gsc.q=%E6%85%A2%E6%80%A7%E9%98%BB%E5%A1%9E%E6%80%A7%E8%82%BA%E7%97%85%EF%BC%88COPD%EF%BC%89",
      },
      {
        name: "肺炎",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E8%82%BA%E7%82%8E&#gsc.tab=0&gsc.sort=date&gsc.q=%E8%82%BA%E7%82%8E",
      },
      {
        name: "胸壁肋膜",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E8%83%B8%E5%A3%81%E8%82%8B%E8%86%9C&#gsc.tab=0&gsc.sort=date&gsc.q=%E8%83%B8%E5%A3%81%E8%82%8B%E8%86%9C",
      },
      {
        name: "慢性呼吸道疾病",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E6%85%A2%E6%80%A7%E5%91%BC%E5%90%B8%E9%81%93%E7%96%BE%E7%97%85&#gsc.tab=0&gsc.sort=date&gsc.q=%E6%85%A2%E6%80%A7%E5%91%BC%E5%90%B8%E9%81%93%E7%96%BE%E7%97%85",
      },
      {
        name: "上呼吸道感染",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E4%B8%8A%E5%91%BC%E5%90%B8%E9%81%93%E6%84%9F%E6%9F%93&#gsc.tab=0&gsc.sort=date&gsc.q=%E4%B8%8A%E5%91%BC%E5%90%B8%E9%81%93%E6%84%9F%E6%9F%93",
      },
      {
        name: "支氣管炎",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E6%94%AF%E6%B0%A3%E7%AE%A1%E7%82%8E&#gsc.tab=0&gsc.sort=date&gsc.q=%E6%94%AF%E6%B0%A3%E7%AE%A1%E7%82%8E",
      },
      {
        name: "肺動脈高壓",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E8%82%BA%E5%8B%95%E8%84%88%E9%AB%98%E5%A3%93&#gsc.tab=0&gsc.sort=date&gsc.q=%E8%82%BA%E5%8B%95%E8%84%88%E9%AB%98%E5%A3%93",
      },
    ],
  },

  heart: {
    id: "heart",
    name: "心血管",
    description: "與心臟與血管相關，如高血壓與冠心病。",
    diseases: [
      {
        name: "高血壓",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E9%AB%98%E8%A1%80%E5%A3%93&#gsc.tab=0&gsc.sort=date&gsc.q=%E9%AB%98%E8%A1%80%E5%A3%93",
      },
      {
        name: "冠狀動脈心臟病",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E5%86%A0%E7%8B%80%E5%8B%95%E8%84%88%E5%BF%83%E8%87%9F%E7%97%85&#gsc.tab=0&gsc.sort=date&gsc.q=%E5%86%A0%E7%8B%80%E5%8B%95%E8%84%88%E5%BF%83%E8%87%9F%E7%97%85",
      },
      {
        name: "心律不整",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E5%BF%83%E5%BE%8B%E4%B8%8D%E6%95%B4&#gsc.tab=0&gsc.sort=date&gsc.q=%E5%BF%83%E5%BE%8B%E4%B8%8D%E6%95%B4",
      },
      {
        name: "心肌梗塞",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E5%BF%83%E8%82%8C%E6%A2%97%E5%A1%9E&#gsc.tab=0&gsc.sort=date&gsc.q=%E5%BF%83%E8%82%8C%E6%A2%97%E5%A1%9E",
      },
      {
        name: "心臟病",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E5%BF%83%E8%87%9F%E7%97%85&#gsc.tab=0&gsc.sort=date&gsc.q=%E5%BF%83%E8%87%9F%E7%97%85",
      },
      {
        name: "靜脈問題",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E9%9D%9C%E8%84%88%E5%95%8F%E9%A1%8C&#gsc.tab=0&gsc.sort=date&gsc.q=%E9%9D%9C%E8%84%88%E5%95%8F%E9%A1%8C",
      },
      {
        name: "血液問題",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E8%A1%80%E6%B6%B2%E5%95%8F%E9%A1%8C&#gsc.tab=0&gsc.sort=date&gsc.q=%E8%A1%80%E6%B6%B2%E5%95%8F%E9%A1%8C",
      },
      {
        name: "主動脈剝離",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E4%B8%BB%E5%8B%95%E8%84%88%E5%89%9D%E9%9B%A2&#gsc.tab=0&gsc.sort=date&gsc.q=%E4%B8%BB%E5%8B%95%E8%84%88%E5%89%9D%E9%9B%A2",
      },
      {
        name: "瓣膜問題",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E7%93%A3%E8%86%9C%E5%95%8F%E9%A1%8C&#gsc.tab=0&gsc.sort=date&gsc.q=%E7%93%A3%E8%86%9C%E5%95%8F%E9%A1%8C",
      },
      {
        name: "血管、血栓",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E8%A1%80%E7%AE%A1%E3%80%81%E8%A1%80%E6%A0%93&#gsc.tab=0&gsc.sort=date&gsc.q=%E8%A1%80%E7%AE%A1%E3%80%81%E8%A1%80%E6%A0%93",
      },
      {
        name: "心肌炎",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E5%BF%83%E8%82%8C%E7%82%8E&#gsc.tab=0&gsc.sort=date&gsc.q=%E5%BF%83%E8%82%8C%E7%82%8E",
      },
    ],
  },

  gi: {
    id: "gi",
    name: "肝膽腸胃",
    description: "與消化系統相關，包括肝臟、膽囊與腸胃道。",
    diseases: [
      {
        name: "胃潰瘍",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E8%83%83%E6%BD%B0%E7%98%8D&#gsc.tab=0&gsc.sort=date&gsc.q=%E8%83%83%E6%BD%B0%E7%98%8D",
      },
      {
        name: "腸胃炎",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E8%85%B8%E8%83%83%E7%82%8E&#gsc.tab=0&gsc.sort=date&gsc.q=%E8%85%B8%E8%83%83%E7%82%8E",
      },
      {
        name: "脂肪肝",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E8%84%82%E8%82%AA%E8%82%9D&#gsc.tab=0&gsc.sort=date&gsc.q=%E8%84%82%E8%82%AA%E8%82%9D",
      },
      {
        name: "B 型肝炎",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=B%20%E5%9E%8B%E8%82%9D%E7%82%8E&#gsc.tab=0&gsc.sort=date&gsc.q=B%20%E5%9E%8B%E8%82%9D%E7%82%8E",
      },
      {
        name: "膽疾病",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E8%86%BD%E7%96%BE%E7%97%85&#gsc.tab=0&gsc.sort=date&gsc.q=%E8%86%BD%E7%96%BE%E7%97%85",
      },
      {
        name: "腸疾病",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E8%85%B8%E7%96%BE%E7%97%85&#gsc.tab=0&gsc.sort=date&gsc.q=%E8%85%B8%E7%96%BE%E7%97%85",
      },
      {
        name: "胃病",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E8%83%83%E7%97%85&#gsc.tab=0&gsc.sort=date&gsc.q=%E8%83%83%E7%97%85",
      },
      {
        name: "急性腸胃炎",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E6%80%A5%E6%80%A7%E8%85%B8%E8%83%83%E7%82%8E&#gsc.tab=0&gsc.sort=date&gsc.q=%E6%80%A5%E6%80%A7%E8%85%B8%E8%83%83%E7%82%8E",
      },
      {
        name: "消化道異常",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E6%B6%88%E5%8C%96%E9%81%93%E7%95%B0%E5%B8%B8&#gsc.tab=0&gsc.sort=date&gsc.q=%E6%B6%88%E5%8C%96%E9%81%93%E7%95%B0%E5%B8%B8",
      },
      {
        name: "大腸直腸",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E5%A4%A7%E8%85%B8%E7%9B%B4%E8%85%B8&#gsc.tab=0&gsc.sort=date&gsc.q=%E5%A4%A7%E8%85%B8%E7%9B%B4%E8%85%B8",
      },
      {
        name: "肝硬化",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E8%82%9D%E7%A1%AC%E5%8C%96&#gsc.tab=0&gsc.sort=date&gsc.q=%E8%82%9D%E7%A1%AC%E5%8C%96",
      },
      {
        name: "肝炎",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E8%82%9D%E7%82%8E&#gsc.tab=0&gsc.sort=date&gsc.q=%E8%82%9D%E7%82%8E",
      },
    ],
  },

  kidney: {
    id: "kidney",
    name: "泌尿腎臟",
    description: "與腎臟及泌尿道相關疾病。",
    diseases: [
      {
        name: "腎結石",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E8%85%8E%E7%B5%90%E7%9F%B3&#gsc.tab=0&gsc.sort=date&gsc.q=%E8%85%8E%E7%B5%90%E7%9F%B3",
      },
      {
        name: "慢性腎臟病",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E6%85%A2%E6%80%A7%E8%85%8E%E8%87%9F%E7%97%85&#gsc.tab=0&gsc.sort=date&gsc.q=%E6%85%A2%E6%80%A7%E8%85%8E%E8%87%9F%E7%97%85",
      },
      {
        name: "膀胱炎",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E8%86%80%E8%83%B1%E7%82%8E&#gsc.tab=0&gsc.sort=date&gsc.q=%E8%86%80%E8%83%B1%E7%82%8E",
      },
      {
        name: "尿道感染",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E5%B0%BF%E9%81%93%E6%84%9F%E6%9F%93&#gsc.tab=0&gsc.sort=date&gsc.q=%E5%B0%BF%E9%81%93%E6%84%9F%E6%9F%93",
      },
      {
        name: "攝護腺",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E6%94%9D%E8%AD%B7%E8%85%BA&#gsc.tab=0&gsc.sort=date&gsc.q=%E6%94%9D%E8%AD%B7%E8%85%BA",
      },
      {
        name: "血液透析",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E8%A1%80%E6%B6%B2%E9%80%8F%E6%9E%90&#gsc.tab=0&gsc.sort=date&gsc.q=%E8%A1%80%E6%B6%B2%E9%80%8F%E6%9E%90",
      },
      {
        name: "輸精管",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E8%BC%B8%E7%B2%BE%E7%AE%A1&#gsc.tab=0&gsc.sort=date&gsc.q=%E8%BC%B8%E7%B2%BE%E7%AE%A1",
      },
      {
        name: "性功能障礙",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E6%80%A7%E5%8A%9F%E8%83%BD%E9%9A%9C%E7%A4%99&#gsc.tab=0&gsc.sort=date&gsc.q=%E6%80%A7%E5%8A%9F%E8%83%BD%E9%9A%9C%E7%A4%99",
      },
      {
        name: "尿道結石",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E5%B0%BF%E9%81%93%E7%B5%90%E7%9F%B3&#gsc.tab=0&gsc.sort=date&gsc.q=%E5%B0%BF%E9%81%93%E7%B5%90%E7%9F%B3",
      },
      {
        name: "睪丸",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E7%9D%AA%E4%B8%B8&#gsc.tab=0&gsc.sort=date&gsc.q=%E7%9D%AA%E4%B8%B8",
      },
      {
        name: "腎功能障礙",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E8%85%8E%E5%8A%9F%E8%83%BD%E9%9A%9C%E7%A4%99&#gsc.tab=0&gsc.sort=date&gsc.q=%E8%85%8E%E5%8A%9F%E8%83%BD%E9%9A%9C%E7%A4%99",
      },
    ],
  },

  ortho: {
    id: "ortho",
    name: "骨科 / 復健",
    description: "骨骼、關節與肌肉相關。",
    diseases: [
      {
        name: "骨折、 脫臼",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E9%AA%A8%E6%8A%98%E3%80%81%20%E8%84%AB%E8%87%BC&#gsc.tab=0&gsc.sort=date&gsc.q=%E9%AA%A8%E6%8A%98%E3%80%81%20%E8%84%AB%E8%87%BC",
      },
      {
        name: "退化性關節炎",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E9%80%80%E5%8C%96%E6%80%A7%E9%97%9C%E7%AF%80%E7%82%8E&#gsc.tab=0&gsc.sort=date&gsc.q=%E9%80%80%E5%8C%96%E6%80%A7%E9%97%9C%E7%AF%80%E7%82%8E",
      },
      {
        name: "肌腱炎",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E8%82%8C%E8%85%B1%E7%82%8E&#gsc.tab=0&gsc.sort=date&gsc.q=%E8%82%8C%E8%85%B1%E7%82%8E",
      },
      {
        name: "下背痛",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E4%B8%8B%E8%83%8C%E7%97%9B&#gsc.tab=0&gsc.sort=date&gsc.q=%E4%B8%8B%E8%83%8C%E7%97%9B",
      },
      {
        name: "扭傷、挫傷",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E6%89%AD%E5%82%B7%E3%80%81%E6%8C%AB%E5%82%B7&#gsc.tab=0&gsc.sort=date&gsc.q=%E6%89%AD%E5%82%B7%E3%80%81%E6%8C%AB%E5%82%B7",
      },
      {
        name: "肌腱筋膜",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E8%82%8C%E8%85%B1%E7%AD%8B%E8%86%9C&#gsc.tab=0&gsc.sort=date&gsc.q=%E8%82%8C%E8%85%B1%E7%AD%8B%E8%86%9C",
      },
      {
        name: "骨質疏鬆症",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E9%AA%A8%E8%B3%AA%E7%96%8F%E9%AC%86%E7%97%87&#gsc.tab=0&gsc.sort=date&gsc.q=%E9%AA%A8%E8%B3%AA%E7%96%8F%E9%AC%86%E7%97%87",
      },
      {
        name: "關節問題",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E9%97%9C%E7%AF%80%E5%95%8F%E9%A1%8C&#gsc.tab=0&gsc.sort=date&gsc.q=%E9%97%9C%E7%AF%80%E5%95%8F%E9%A1%8C",
      },
    ],
  },

  obgyn: {
    id: "obgyn",
    name: "婦產科",
    description: "女性生殖系統與懷孕相關疾病。",
    diseases: [
      {
        name: "子宮肌瘤",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E5%AD%90%E5%AE%AE%E8%82%8C%E7%98%A4&#gsc.tab=0&gsc.sort=date&gsc.q=%E5%AD%90%E5%AE%AE%E8%82%8C%E7%98%A4",
      },
      {
        name: "多囊性卵巢症候群",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E5%A4%9A%E5%9B%8A%E6%80%A7%E5%8D%B5%E7%A6%8A%E7%97%87%E5%80%99%E7%BE%A4&#gsc.tab=0&gsc.sort=date&gsc.q=%E5%A4%9A%E5%9B%8A%E6%80%A7%E5%8D%B5%E7%A6%8A%E7%97%87%E5%80%99%E7%BE%A4",
      },
      {
        name: "更年期症候群",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E6%9B%B4%E5%B9%B4%E6%9C%9F%E7%97%87%E5%80%99%E7%BE%A4&#gsc.tab=0&gsc.sort=date&gsc.q=%E6%9B%B4%E5%B9%B4%E6%9C%9F%E7%97%87%E5%80%99%E7%BE%A4",
      },
      {
        name: "不孕",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E4%B8%8D%E5%AD%95&#gsc.tab=0&gsc.sort=date&gsc.q=%E4%B8%8D%E5%AD%95",
      },
      {
        name: "避孕方法",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E9%81%BF%E5%AD%95%E6%96%B9%E6%B3%95&#gsc.tab=0&gsc.sort=date&gsc.q=%E9%81%BF%E5%AD%95%E6%96%B9%E6%B3%95",
      },
      {
        name: "懷孕須知",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E6%87%B7%E5%AD%95%E9%A0%88%E7%9F%A5&#gsc.tab=0&gsc.sort=date&gsc.q=%E6%87%B7%E5%AD%95%E9%A0%88%E7%9F%A5",
      },
      {
        name: "乳房問題",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E4%B9%B3%E6%88%BF%E5%95%8F%E9%A1%8C&#gsc.tab=0&gsc.sort=date&gsc.q=%E4%B9%B3%E6%88%BF%E5%95%8F%E9%A1%8C",
      },
      {
        name: "卵巢、輸卵管",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E5%8D%B5%E5%B7%A2%E3%80%81%E8%BC%B8%E5%8D%B5%E7%AE%A1&#gsc.tab=0&gsc.sort=date&gsc.q=%E5%8D%B5%E5%B7%A2%E3%80%81%E8%BC%B8%E5%8D%B5%E7%AE%A1",
      },
      {
        name: "陰道問題",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E9%99%B0%E9%81%93%E5%95%8F%E9%A1%8C&#gsc.tab=0&gsc.sort=date&gsc.q=%E9%99%B0%E9%81%93%E5%95%8F%E9%A1%8C",
      },
    ],
  },

  dental: {
    id: "dental",
    name: "牙科・口腔",
    description: "與牙齒與口腔健康相關，包含牙周病、齒列矯正與植牙等。",
    diseases: [
      {
        name: "牙炎",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E7%89%99%E7%82%8E&#gsc.tab=0&gsc.sort=date&gsc.q=%E7%89%99%E7%82%8E",
      },
      {
        name: "牙周病",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E7%89%99%E5%91%A8%E7%97%85&#gsc.tab=0&gsc.sort=date&gsc.q=%E7%89%99%E5%91%A8%E7%97%85",
      },
      {
        name: "牙齒矯正",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E7%89%99%E9%BD%92%E7%9F%AF%E6%AD%A3&#gsc.tab=0&gsc.sort=date&gsc.q=%E7%89%99%E9%BD%92%E7%9F%AF%E6%AD%A3",
      },
      {
        name: "植牙 / 假牙",
        link: "https://www.healthnews.com.tw/search/google_result/?keyword=%E6%A4%8D%E7%89%99%20/%20%E5%81%87%E7%89%99&#gsc.tab=0&gsc.sort=date&gsc.q=%E6%A4%8D%E7%89%99%20/%20%E5%81%87%E7%89%99",
      },
    ],
  },
};

/**
 * 用「角度」來決定圓球位置，讓 10 顆球繞著綠人形成一個圓
 */
const CENTER_X = 50;
const CENTER_Y = 49;
const RADIUS_X = 60;
const RADIUS_Y = 44;

// 10 顆節點的位置設定
const NODE_CONFIG = [
  { id: "neuro", label: "神經系統", icon: "🧠", angle: -90 }, // 上
  { id: "eye", label: "眼科", icon: "👁️", angle: -50 },
  { id: "ent", label: "耳鼻喉", icon: "👂", angle: -15 },
  { id: "chest", label: "呼吸胸腔", icon: "🫁", angle: 18 },
  { id: "obgyn", label: "婦產科", icon: "♀️", angle: 52 },
  { id: "ortho", label: "骨科復健", icon: "🦵", angle: 90 }, // 下
  { id: "kidney", label: "泌尿腎臟", icon: "🧪", angle: 128 },
  { id: "gi", label: "肝膽腸胃", icon: "🩺", angle: 162 },
  { id: "dental", label: "牙科・口腔", icon: "🦷", angle: 194 },
  { id: "heart", label: "心血管", icon: "❤️", angle: 230 },
];

// 把角度轉成實際的 x / y (%)
const BODY_NODES = NODE_CONFIG.map((cfg) => {
  const rad = (cfg.angle * Math.PI) / 180;
  const x = CENTER_X + RADIUS_X * Math.cos(rad);
  const y = CENTER_Y + RADIUS_Y * Math.sin(rad);
  return {
    ...cfg,
    x: `${x}%`,
    y: `${y}%`,
  };
});

export default function BodyMapWidget() {
  const [activeId, setActiveId] = useState("neuro");
  const active = SYSTEMS[activeId];
 const [openMain, setOpenMain] = useState(null);

const toggleMain = (key) => {
  setOpenMain(openMain === key ? null : key);
};;

  return (
    <>
      {/* 上半部：人體地圖 + 右側疾病資訊 */}
      <div className="body-map-layout">
        {/* 左側：疾病專區按鈕 */}
        <div className="body-map-sidebar">
          <div className="body-map-sidebar-title">疾病專區</div>
          {Object.values(SYSTEMS).map((sys) => (
            <button
              key={sys.id}
              onClick={() => setActiveId(sys.id)}
              className={
                "body-map-sidebar-btn" +
                (activeId === sys.id ? " body-map-sidebar-btn-active" : "")
              }
            >
              {sys.name}
            </button>
          ))}
        </div>

        {/* 中間：綠人 + 10 顆圓球 */}
        <div className="body-map-figure-wrapper">
          <div className="body-map-figure">
            <div className="body-human">
              <div className="body-head" />
              <div className="body-upper">
                <div className="body-arm body-arm-left" />
                <div className="body-torso" />
                <div className="body-arm body-arm-right" />
              </div>
              <div className="body-lower">
                <div className="body-leg body-leg-left" />
                <div className="body-leg body-leg-right" />
              </div>
            </div>
          </div>

          {BODY_NODES.map((node) => (
            <button
              key={node.id}
              onClick={() => setActiveId(node.id)}
              style={{
                top: node.y,
                left: node.x,
                transform: "translate(-50%, -50%)",
              }}
              className={
                "body-map-node" +
                (activeId === node.id ? " body-map-node-active" : "")
              }
            >
              <span className="body-map-node-icon">{node.icon}</span>
              <span className="body-map-node-label">{node.label}</span>
            </button>
          ))}
        </div>

        {/* 右側：疾病資訊 */}
        <div className="body-map-info">
          <p className="body-map-info-hint">
            點選人體周圍部位或左側分類，可查看相對應的疾病資訊
          </p>
          <h3 className="body-map-info-title">{active.name}</h3>
          <p className="body-map-info-desc">{active.description}</p>

          <h4 className="body-map-info-subtitle">常見相關疾病：</h4>
          <ul className="body-map-info-list">
            {active.diseases.map((d) => (
              <li key={d.name}>
                <a
                  href={d.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="body-map-disease-link"
                >
                  {d.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 下半部：整個網頁底下的兩欄專區（紅／藍可下拉，白色是相關議題） */}
<div className="body-extra-sections">

  {/* 左邊紅色欄位 */}
  <div className="body-extra-column body-extra-column-left">

    {/* 兒科・青少年 */}
    <div className="body-extra-main-block">
      <div
        className="body-extra-main body-extra-main-red"
        onClick={() => toggleMain("pediatrics")}
      >
        兒科・青少年
      </div>
      {openMain === "pediatrics" && (
        <div className="body-extra-tags-left">
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E5%AC%B0%E5%B9%BC%E5%85%92%E7%99%BC%E7%87%92&#gsc.tab=0&gsc.sort=date&gsc.q=%E5%AC%B0%E5%B9%BC%E5%85%92%E7%99%BC%E7%87%92">嬰幼兒發燒</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E5%85%92%E7%AB%A5%E7%96%AB%E8%8B%97%E6%8E%A5%E7%A8%AE&#gsc.tab=0&gsc.sort=date&gsc.q=%E5%85%92%E7%AB%A5%E7%96%AB%E8%8B%97%E6%8E%A5%E7%A8%AE">兒童疫苗接種</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E6%88%90%E9%95%B7%E8%88%87%E7%99%BC%E8%82%B2%E9%81%B2%E7%B7%A9&#gsc.tab=0&gsc.sort=date&gsc.q=%E6%88%90%E9%95%B7%E8%88%87%E7%99%BC%E8%82%B2%E9%81%B2%E7%B7%A9">成長與發育遲緩</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E9%9D%92%E5%B0%91%E5%B9%B4%E6%88%90%E9%95%B7&#gsc.tab=0&gsc.sort=date&gsc.q=%E9%9D%92%E5%B0%91%E5%B9%B4%E6%88%90%E9%95%B7">青少年成長</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E5%AD%B8%E7%AB%A5%E8%A6%96%E5%8A%9B%E8%88%87%E8%BF%91%E8%A6%96&#gsc.tab=0&gsc.sort=date&gsc.q=%E5%AD%B8%E7%AB%A5%E8%A6%96%E5%8A%9B%E8%88%87%E8%BF%91%E8%A6%96">學童視力與近視</a>
        </div>
      )}
    </div>

    {/* 皮膚科 */}
    <div className="body-extra-main-block">
      <div
        className="body-extra-main body-extra-main-red"
        onClick={() => toggleMain("dermatology")}
      >
        皮膚科
      </div>
      {openMain === "dermatology" && (
        <div className="body-extra-tags-left">
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E6%BF%95%E7%96%B9%E3%83%BB%E7%95%B0%E4%BD%8D%E6%80%A7%E7%9A%AE%E8%86%9A%E7%82%8E&#gsc.tab=0&gsc.sort=date&gsc.q=%E6%BF%95%E7%96%B9%E3%83%BB%E7%95%B0%E4%BD%8D%E6%80%A7%E7%9A%AE%E8%86%9A%E7%82%8E">濕疹・異位性皮膚炎</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E7%97%98%E7%97%98%E8%88%87%E7%B2%89%E5%88%BA%E5%95%8F%E9%A1%8C&#gsc.tab=0&gsc.sort=date&gsc.q=%E7%97%98%E7%97%98%E8%88%87%E7%B2%89%E5%88%BA%E5%95%8F%E9%A1%8C">痘痘與粉刺問題</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E8%95%81%E9%BA%BB%E7%96%B9&#gsc.tab=0&gsc.sort=date&gsc.q=%E8%95%81%E9%BA%BB%E7%96%B9">蕁麻疹</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E9%BB%B4%E8%8F%8C%E6%84%9F%E6%9F%93%E3%83%BB%E9%A6%99%E6%B8%AF%E8%85%B3&#gsc.tab=0&gsc.sort=date&gsc.q=%E9%BB%B4%E8%8F%8C%E6%84%9F%E6%9F%93%E3%83%BB%E9%A6%99%E6%B8%AF%E8%85%B3">黴菌感染・香港腳</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E7%87%92%E7%87%99%E5%82%B7&#gsc.tab=0&gsc.sort=date&gsc.q=%E7%87%92%E7%87%99%E5%82%B7">燒燙傷</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E4%B9%BE%E7%99%AC&#gsc.tab=0&gsc.sort=date&gsc.q=%E4%B9%BE%E7%99%AC">乾癬</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E7%8B%90%E8%87%AD&#gsc.tab=0&gsc.sort=date&gsc.q=%E7%8B%90%E8%87%AD">狐臭</a>
        </div>
      )}
    </div>

    {/* 醫學美容 */}
    <div className="body-extra-main-block">
      <div
        className="body-extra-main body-extra-main-red"
        onClick={() => toggleMain("aesthetic")}
      >
        醫學美容
      </div>
      {openMain === "aesthetic" && (
        <div className="body-extra-tags-left">
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E9%9B%B7%E5%B0%84%E7%BE%8E%E7%99%BD%E8%88%87%E9%99%A4%E6%96%91&#gsc.tab=0&gsc.sort=date&gsc.q=%E9%9B%B7%E5%B0%84%E7%BE%8E%E7%99%BD%E8%88%87%E9%99%A4%E6%96%91">雷射美白與除斑</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E9%86%AB%E7%BE%8E%E8%A1%93%E5%BE%8C%E7%85%A7%E8%AD%B7&#gsc.tab=0&gsc.sort=date&gsc.q=%E9%86%AB%E7%BE%8E%E8%A1%93%E5%BE%8C%E7%85%A7%E8%AD%B7">醫美術後照護</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E9%AB%94%E9%87%8D%E6%8E%A7%E5%88%B6%E8%88%87%E5%A1%91%E8%BA%AB&#gsc.tab=0&gsc.sort=date&gsc.q=%E9%AB%94%E9%87%8D%E6%8E%A7%E5%88%B6%E8%88%87%E5%A1%91%E8%BA%AB">體重控制與塑身</a>
        </div>
      )}
    </div>

    {/* 身心精神 */}
    <div className="body-extra-main-block">
      <div
        className="body-extra-main body-extra-main-red"
        onClick={() => toggleMain("mental")}
      >
        身心精神
      </div>
      {openMain === "mental" && (
        <div className="body-extra-tags-left">
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E7%84%A6%E6%85%AE%E7%97%87%E8%88%87%E6%81%90%E6%85%8C%E7%99%BC%E4%BD%9C&#gsc.tab=0&gsc.sort=date&gsc.q=%E7%84%A6%E6%85%AE%E7%97%87%E8%88%87%E6%81%90%E6%85%8C%E7%99%BC%E4%BD%9C">焦慮症與恐慌發作</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E6%86%82%E9%AC%B1%E7%97%87&#gsc.tab=0&gsc.sort=date&gsc.q=%E6%86%82%E9%AC%B1%E7%97%87">憂鬱症</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E5%A4%B1%E7%9C%A0%E8%88%87%E7%9D%A1%E7%9C%A0%E9%9A%9C%E7%A4%99&#gsc.tab=0&gsc.sort=date&gsc.q=%E5%A4%B1%E7%9C%A0%E8%88%87%E7%9D%A1%E7%9C%A0%E9%9A%9C%E7%A4%99">失眠與睡眠障礙</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E5%BC%B7%E8%BF%AB%E7%97%87%E3%83%BB%E5%BC%B7%E8%BF%AB%E8%A1%8C%E7%82%BA&#gsc.tab=0&gsc.sort=date&gsc.q=%E5%BC%B7%E8%BF%AB%E7%97%87%E3%83%BB%E5%BC%B7%E8%BF%AB%E8%A1%8C%E7%82%BA">強迫症・強迫行為</a>
        </div>
      )}
    </div>

    {/* 銀髮照顧 */}
    <div className="body-extra-main-block">
      <div
        className="body-extra-main body-extra-main-red"
        onClick={() => toggleMain("senior")}
      >
        銀髮照顧
      </div>
      {openMain === "senior" && (
        <div className="body-extra-tags-left">
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E5%A4%B1%E6%99%BA%E7%97%87%E7%85%A7%E8%AD%B7&#gsc.tab=0&gsc.sort=date&gsc.q=%E5%A4%B1%E6%99%BA%E7%97%87%E7%85%A7%E8%AD%B7">失智症照護</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E9%AA%A8%E8%B3%AA%E7%96%8F%E9%AC%86%E8%88%87%E9%AA%A8%E6%8A%98%E9%A2%A8%E9%9A%AA&#gsc.tab=0&gsc.sort=date&gsc.q=%E9%AA%A8%E8%B3%AA%E7%96%8F%E9%AC%86%E8%88%87%E9%AA%A8%E6%8A%98%E9%A2%A8%E9%9A%AA">骨質疏鬆與骨折風險</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E8%82%8C%E5%B0%91%E7%97%87&#gsc.tab=0&gsc.sort=date&gsc.q=%E8%82%8C%E5%B0%91%E7%97%87">肌少症</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E9%95%B7%E7%85%A7%E8%88%87%E8%B3%87%E6%BA%90%E7%94%B3%E8%AB%8B&#gsc.tab=0&gsc.sort=date&gsc.q=%E9%95%B7%E7%85%A7%E8%88%87%E8%B3%87%E6%BA%90%E7%94%B3%E8%AB%8B">長照與資源申請</a>
        </div>
      )}
    </div>

    {/* 心靈・樂活 */}
    <div className="body-extra-main-block">
      <div
        className="body-extra-main body-extra-main-red"
        onClick={() => toggleMain("mindful")}
      >
        心靈・樂活
      </div>
      {openMain === "mindful" && (
        <div className="body-extra-tags-left">
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E5%85%A9%E6%80%A7%E8%A9%B1%E9%A1%8C&#gsc.tab=0&gsc.sort=date&gsc.q=%E5%85%A9%E6%80%A7%E8%A9%B1%E9%A1%8C">兩性話題</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E5%A3%93%E5%8A%9B%E7%B4%93%E8%A7%A3%E6%96%B9%E6%B3%95&#gsc.tab=0&gsc.sort=date&gsc.q=%E5%A3%93%E5%8A%9B%E7%B4%93%E8%A7%A3%E6%96%B9%E6%B3%95">壓力紓解方法</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E8%81%B7%E5%A0%B4%E5%80%A6%E6%80%A0%E8%88%87%E8%AA%BF%E9%81%A9&#gsc.tab=0&gsc.sort=date&gsc.q=%E8%81%B7%E5%A0%B4%E5%80%A6%E6%80%A0%E8%88%87%E8%AA%BF%E9%81%A9">職場倦怠與調適</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E5%BF%83%E9%9D%88%E6%88%90%E9%95%B7&#gsc.tab=0&gsc.sort=date&gsc.q=%E5%BF%83%E9%9D%88%E6%88%90%E9%95%B7">心靈成長</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E8%87%AA%E6%88%91%E6%88%90%E9%95%B7%E8%88%87%E7%9B%AE%E6%A8%99%E8%A8%AD%E5%AE%9A&#gsc.tab=0&gsc.sort=date&gsc.q=%E8%87%AA%E6%88%91%E6%88%90%E9%95%B7%E8%88%87%E7%9B%AE%E6%A8%99%E8%A8%AD%E5%AE%9A">自我成長與目標設定</a>
        </div>
      )}
    </div>
  </div>

  {/* 右邊藍色欄位 */}
  <div className="body-extra-column body-extra-column-right">

    {/* 生醫新知 */}
    <div className="body-extra-main-block">
      <div
        className="body-extra-main body-extra-main-blue"
        onClick={() => toggleMain("biomed")}
      >
        生醫新知
      </div>
      {openMain === "biomed" && (
        <div className="body-extra-tags-right">
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E9%8A%80%E9%AB%AE%E7%85%A7%E8%AD%B7&#gsc.tab=0&gsc.sort=date&gsc.q=%E9%8A%80%E9%AB%AE%E7%85%A7%E8%AD%B7">銀髮照護</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E5%85%8D%E7%96%AB%E7%99%82%E6%B3%95&#gsc.tab=0&gsc.sort=date&gsc.q=%E5%85%8D%E7%96%AB%E7%99%82%E6%B3%95">免疫療法</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E5%A4%B1%E6%99%BA%E7%97%87&#gsc.tab=0&gsc.sort=date&gsc.q=%E5%A4%B1%E6%99%BA%E7%97%87">失智症</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=AI%20%E5%9C%A8%E9%86%AB%E7%99%82%E4%B8%AD%E7%9A%84%E6%87%89%E7%94%A8&#gsc.tab=0&gsc.sort=date&gsc.q=AI%20%E5%9C%A8%E9%86%AB%E7%99%82%E4%B8%AD%E7%9A%84%E6%87%89%E7%94%A8">AI 在醫療中的應用</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E8%82%8C%E5%B0%91%E7%97%87&#gsc.tab=0&gsc.sort=date&gsc.q=%E8%82%8C%E5%B0%91%E7%97%87">肌少症</a>
        </div>
      )}
    </div>

    {/* 感染科 */}
    <div className="body-extra-main-block">
      <div
        className="body-extra-main body-extra-main-blue"
        onClick={() => toggleMain("infection")}
      >
        感染科
      </div>
      {openMain === "infection" && (
        <div className="body-extra-tags-right">
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E5%B8%B6%E7%8B%80%E7%96%B1%E7%96%B9&#gsc.tab=0&gsc.sort=date&gsc.q=%E5%B8%B6%E7%8B%80%E7%96%B1%E7%96%B9">帶狀疱疹</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E6%96%B0%E5%86%A0%E8%82%BA%E7%82%8E&#gsc.tab=0&gsc.sort=date&gsc.q=%E6%96%B0%E5%86%A0%E8%82%BA%E7%82%8E">新冠肺炎</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E7%99%BB%E9%9D%A9%E7%86%B1&#gsc.tab=0&gsc.sort=date&gsc.q=%E7%99%BB%E9%9D%A9%E7%86%B1">登革熱</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E8%85%B8%E7%97%85%E6%AF%92&#gsc.tab=0&gsc.sort=date&gsc.q=%E8%85%B8%E7%97%85%E6%AF%92">腸病毒</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E5%8B%95%E7%89%A9%E5%82%B3%E6%9F%93%E7%97%85&#gsc.tab=0&gsc.sort=date&gsc.q=%E5%8B%95%E7%89%A9%E5%82%B3%E6%9F%93%E7%97%85">動物傳染病</a>
        </div>
      )}
    </div>

    {/* 癌症專區 */}
    <div className="body-extra-main-block">
      <div
        className="body-extra-main body-extra-main-blue"
        onClick={() => toggleMain("cancer")}
      >
        癌症專區
      </div>
      {openMain === "cancer" && (
        <div className="body-extra-tags-right">
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E4%B9%B3%E7%99%8C&#gsc.tab=0&gsc.sort=date&gsc.q=%E4%B9%B3%E7%99%8C">乳癌</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E8%83%B0%E8%87%9F%E7%99%8C&#gsc.tab=0&gsc.sort=date&gsc.q=%E8%83%B0%E8%87%9F%E7%99%8C">胰臟癌</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E9%A0%AD%E9%A0%B8%E7%99%8C&#gsc.tab=0&gsc.sort=date&gsc.q=%E9%A0%AD%E9%A0%B8%E7%99%8C">頭頸癌</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E8%85%A6%E7%98%A4&#gsc.tab=0&gsc.sort=date&gsc.q=%E8%85%A6%E7%98%A4">腦瘤</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E8%83%83%E7%99%8C&#gsc.tab=0&gsc.sort=date&gsc.q=%E8%83%83%E7%99%8C">胃癌</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E9%A3%9F%E9%81%93%E7%99%8C&#gsc.tab=0&gsc.sort=date&gsc.q=%E9%A3%9F%E9%81%93%E7%99%8C">食道癌</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E5%8D%B5%E5%B7%A2%E7%99%8C&#gsc.tab=0&gsc.sort=date&gsc.q=%E5%8D%B5%E5%B7%A2%E7%99%8C">卵巢癌</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E6%94%9D%E8%AD%B7%E8%85%BA%E7%99%8C&#gsc.tab=0&gsc.sort=date&gsc.q=%E6%94%9D%E8%AD%B7%E8%85%BA%E7%99%8C">攝護腺癌</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E6%B7%8B%E5%B7%B4%E7%99%8C&#gsc.tab=0&gsc.sort=date&gsc.q=%E6%B7%8B%E5%B7%B4%E7%99%8C">淋巴癌</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E7%99%BD%E8%A1%80%E7%97%85&#gsc.tab=0&gsc.sort=date&gsc.q=%E7%99%BD%E8%A1%80%E7%97%85">白血病</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E5%A4%A7%E8%85%B8%E7%9B%B4%E8%85%B8%E7%99%8C&#gsc.tab=0&gsc.sort=date&gsc.q=%E5%A4%A7%E8%85%B8%E7%9B%B4%E8%85%B8%E7%99%8C">大腸直腸癌</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E8%82%BA%E7%99%8C&#gsc.tab=0&gsc.sort=date&gsc.q=%E8%82%BA%E7%99%8C">肺癌</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E7%99%8C%E7%97%87%E7%AF%A9%E6%AA%A2%E8%88%87%E6%97%A9%E6%9C%9F%E7%99%BC%E7%8F%BE&#gsc.tab=0&gsc.sort=date&gsc.q=%E7%99%8C%E7%97%87%E7%AF%A9%E6%AA%A2%E8%88%87%E6%97%A9%E6%9C%9F%E7%99%BC%E7%8F%BE">癌症篩檢與早期發現</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E5%8C%96%E7%99%82%E8%88%87%E5%89%AF%E4%BD%9C%E7%94%A8%E7%85%A7%E8%AD%B7&#gsc.tab=0&gsc.sort=date&gsc.q=%E5%8C%96%E7%99%82%E8%88%87%E5%89%AF%E4%BD%9C%E7%94%A8%E7%85%A7%E8%AD%B7">化療與副作用照護</a>
        </div>
      )}
    </div>

    {/* 中醫 */}
    <div className="body-extra-main-block">
      <div
        className="body-extra-main body-extra-main-blue"
        onClick={() => toggleMain("tcm")}
      >
        中醫
      </div>
      {openMain === "tcm" && (
        <div className="body-extra-tags-right">
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E5%9B%9B%E5%AD%A3%E9%A4%8A%E7%94%9F%E8%88%87%E9%A3%9F%E8%A3%9C&#gsc.tab=0&gsc.sort=date&gsc.q=%E5%9B%9B%E5%AD%A3%E9%A4%8A%E7%94%9F%E8%88%87%E9%A3%9F%E8%A3%9C">四季養生與食補</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E9%87%9D%E7%81%B8%E6%B2%BB%E7%99%82&#gsc.tab=0&gsc.sort=date&gsc.q=%E9%87%9D%E7%81%B8%E6%B2%BB%E7%99%82">針灸治療</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E4%B8%AD%E8%97%A5%E8%AA%BF%E7%90%86%E9%AB%94%E8%B3%AA&#gsc.tab=0&gsc.sort=date&gsc.q=%E4%B8%AD%E8%97%A5%E8%AA%BF%E7%90%86%E9%AB%94%E8%B3%AA">中藥調理體質</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E5%A4%B1%E7%9C%A0%E7%9A%84%E4%B8%AD%E9%86%AB%E7%99%82%E6%B3%95&#gsc.tab=0&gsc.sort=date&gsc.q=%E5%A4%B1%E7%9C%A0%E7%9A%84%E4%B8%AD%E9%86%AB%E7%99%82%E6%B3%95">失眠的中醫療法</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E5%A9%A6%E7%A7%91%E8%88%87%E7%B6%93%E6%9C%9F%E8%AA%BF%E7%90%86&#gsc.tab=0&gsc.sort=date&gsc.q=%E5%A9%A6%E7%A7%91%E8%88%87%E7%B6%93%E6%9C%9F%E8%AA%BF%E7%90%86">婦科與經期調理</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E4%B8%AD%E9%86%AB%E5%85%A7%E7%A7%91&#gsc.tab=0&gsc.sort=date&gsc.q=%E4%B8%AD%E9%86%AB%E5%85%A7%E7%A7%91">中醫內科</a>
        </div>
      )}
    </div>

    {/* 運動醫學 */}
    <div className="body-extra-main-block">
      <div
        className="body-extra-main body-extra-main-blue"
        onClick={() => toggleMain("sportsmed")}
      >
        運動醫學
      </div>
      {openMain === "sportsmed" && (
        <div className="body-extra-tags-right">
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E9%81%8B%E5%8B%95%E5%82%B7%E5%AE%B3%E9%A0%90%E9%98%B2&#gsc.tab=0&gsc.sort=date&gsc.q=%E9%81%8B%E5%8B%95%E5%82%B7%E5%AE%B3%E9%A0%90%E9%98%B2">運動傷害預防</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E6%8B%89%E5%82%B7%E8%88%87%E6%89%AD%E5%82%B7%E8%99%95%E7%90%86&#gsc.tab=0&gsc.sort=date&gsc.q=%E6%8B%89%E5%82%B7%E8%88%87%E6%89%AD%E5%82%B7%E8%99%95%E7%90%86">拉傷與扭傷處理</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E8%82%8C%E5%8A%9B%E8%A8%93%E7%B7%B4%E8%A7%80%E5%BF%B5&#gsc.tab=0&gsc.sort=date&gsc.q=%E8%82%8C%E5%8A%9B%E8%A8%93%E7%B7%B4%E8%A7%80%E5%BF%B5">肌力訓練觀念</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E9%81%8B%E5%8B%95%E5%89%8D%E7%86%B1%E8%BA%AB%E8%88%87%E4%BC%B8%E5%B1%95&#gsc.tab=0&gsc.sort=date&gsc.q=%E9%81%8B%E5%8B%95%E5%89%8D%E7%86%B1%E8%BA%AB%E8%88%87%E4%BC%B8%E5%B1%95">運動前熱身與伸展</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E5%B1%85%E5%AE%B6%E9%81%8B%E5%8B%95&#gsc.tab=0&gsc.sort=date&gsc.q=%E5%B1%85%E5%AE%B6%E9%81%8B%E5%8B%95">居家運動</a>
        </div>
      )}
    </div>

    {/* 營養飲食 */}
    <div className="body-extra-main-block">
      <div
        className="body-extra-main body-extra-main-blue"
        onClick={() => toggleMain("nutrition")}
      >
        營養飲食
      </div>
      {openMain === "nutrition" && (
        <div className="body-extra-tags-right">
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E5%9D%87%E8%A1%A1%E9%A3%B2%E9%A3%9F%E5%8E%9F%E5%89%87&#gsc.tab=0&gsc.sort=date&gsc.q=%E5%9D%87%E8%A1%A1%E9%A3%B2%E9%A3%9F%E5%8E%9F%E5%89%87">均衡飲食原則</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E6%B8%9B%E9%87%8D%E8%88%87%E7%86%B1%E9%87%8F%E6%8E%A7%E5%88%B6&#gsc.tab=0&gsc.sort=date&gsc.q=%E6%B8%9B%E9%87%8D%E8%88%87%E7%86%B1%E9%87%8F%E6%8E%A7%E5%88%B6">減重與熱量控制</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E4%B8%89%E9%AB%98%E9%A3%B2%E9%A3%9F%E7%AE%A1%E7%90%86&#gsc.tab=0&gsc.sort=date&gsc.q=%E4%B8%89%E9%AB%98%E9%A3%B2%E9%A3%9F%E7%AE%A1%E7%90%86">三高飲食管理</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E5%9C%B0%E4%B8%AD%E6%B5%B7%E9%A3%B2%E9%A3%9F&#gsc.tab=0&gsc.sort=date&gsc.q=%E5%9C%B0%E4%B8%AD%E6%B5%B7%E9%A3%B2%E9%A3%9F">地中海飲食</a>
          <a className="body-extra-tag" href="https://www.healthnews.com.tw/search/google_result/?keyword=%E7%B4%A0%E9%A3%9F%E8%88%87%E7%87%9F%E9%A4%8A%E8%A3%9C%E5%85%85&#gsc.tab=0&gsc.sort=date&gsc.q=%E7%B4%A0%E9%A3%9F%E8%88%87%E7%87%9F%E9%A4%8A%E8%A3%9C%E5%85%85">素食與營養補充</a>
        </div>
      )}
    </div>

  </div>
</div>
    </>
);
}