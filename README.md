<div align='center'>
    
# Social-Network-Service
 SNS 백엔드 서비스 구현

<p>
    <img src="https://img.shields.io/badge/Node.js-%23339933?style=flat&logo=Swift&logoColor=white"/>
    <img src="https://img.shields.io/badge/EXPRESS-%23000000?style=flat&logo=Express&logoColor=white"/>
    <img src="https://img.shields.io/badge/Sequelize-%2352B0E7?style=flat&logo=Sequelize&logoColor=white"/>
    <img src="https://img.shields.io/badge/MySQL-%234479A1?style=flat&logo=MySQL&logoColor=white"/>
</p>
    
# 💡 서비스 개요

---

📌 본 서비스는 SNS(Social Network Service)이다.

📌 사용자는 본 서비스에 접속하여, 게시물을 업로드하거나 다른 사람의 게시물을 확인하고, 좋아요 수를 누를 수 있다.

`개발 기간: 7.20(수) ~ 7.26(화) + a`
    
</div>

<br>
<br>
<br>
<br>
<br>

# ⚙️ 요구사항 분석 및 REST API 설계

---

## 👺 Must Have

1. 유저 관리
    
    📍 유저 회원가입
    
    ➡️ 이메일을 ID로 사용
    
    **POST /users/signup**
    
    ```json
    // request
    {
    	"userId": "tester1@naver.com",
    	"password": "qwer1234",
    	"userName": "tester1"
    }
    ```
    
    ```json
    // response
    {
    	"message": "회원가입이 완료됐습니다!",
    }
    ```
    
    📍 유저 로그인 및 인증
    
    ➡️ **JWT 토큰**을 발급받으며, 이를 추후 사용자 인증으로 사용
    
    **POST /users/signin**
    
    ```json
    // request
    {
    	"userId": "tester1@naver.com",
    	"password": "qwer1234",
    }
    ```
    
    ```json
    // response
    {
    	"message": "로그인이 완료됐습니다!",
    }
    
    // JWT
    Authorization: "Bearer dskfjiowenv12s@$4"
    ```
    
2. 게시글
    
    📍 게시글 생성
    
    ➡️ 제목, 내용, 해시태그 등을 입력하여 생성 (제목, 내용, 해시태그는 필수 입력사항)
    
    ➡️ **작성자 정보는 request body에 존재하지 않고, 해당 API를 요청한 인증정보에서 추출하여 등록** (API단에서 토큰에서 얻은 사용자 정보를 게시글 생성 때 작성자로 넣어 사용)
    
    ➡️ 해시태그는 #로 시작되고 ,로 구분되는 텍스트가 입력됨
    ex) {”hashtags”, “#맛집,#서울,#브런치 카페,#주말”, …}
    
    **POST /tweets/create**
    
    ```json
    // request
    {
    	"title": "제목",
    	"contents": "내용",
    	"해시태그": "['해시태그1','해시태그2', ...]",
    }
    
    // 토큰에서 얻은 사용자 정보에서 추출하여 작성자 정보 따로 등록
    ```
    
    ```json
    // response
    {
    	"message": "게시글이 생성됐습니다!"
    }
    ```
    
    📍 게시글 수정
    
    ➡️ 작성자만 수정 가능 
    
    **PATCH /tweets/update/:tweetNum**
    
    ```json
    // request
    params: tweetNum
    {
    	"title": "제목",
    	"contents": "내용",
    	"해시태그": "["해시태그1","해시태그2", ...]",
    }
    ```
    
    ```json
    // response
    {
    	"message": "게시글이 수정됐습니다!"
    }
    ```
    
    📍 게시글 삭제 
    
    ➡️ 작성자만 삭제 가능
    
    ➡️ 작성자는 삭제 게시글 복구 가능
    
    **PATCH /tweets/delete/:tweetNum - 삭제**
    
    ```json
    // request
    params: tweetNum
    {
    }
    ```
    
    ```json
    // response 
    {
    	"message": "게시글이 삭제됐습니다!"
    }
    ```
    
    **PATCH /tweets/revoke/:tweetNum - 복구**
    
    ```json
    // request
    params: tweetNum
    {
    }
    ```
    
    ```json
    // response
    {
    	"message": "게시글이 복구됐습니다!",
    }
    ```
    
    📍 게시글 상세보기
    
    ➡️ 모든 사용자는 모든 게시물 보기 가능
    
    ➡️ 작성자를 포함한 사용자는 본 게시물에 좋아요 누르기 가능 (좋아요 다시 누르면 좋아요 취소)
    
    ➡️ 작성자 포함한 사용자가 게시글을 상세보기 하면 조회수 1 증가 (회수제한 x)
    
    **GET /tweets/:tweetNum**
    
    ```json
    // request
    params: tweetNum
    {
    }
    ```
    
    ```json
    // response
    {
    	  "tweetId": 20,
        "title": "제목!!",
        "contents": "내용!!",
        "views": 0,
        "agrees": 0,
        "deleted": false,
        "createdAt": "2022-07-21T05:25:46.000Z",
        "updatedAt": "2022-07-21T07:28:19.000Z",
        "userId": 1
    }
    ```
    
    📍 게시글 목록
    
    ➡️ 모든 사용자는 모든 게시물 보기 가능
    
    **GET /tweets**
    
    ```json
    // request
    {
    }
    ```
    
    ```json
    // response
    {
    	tweetsList: [
    		{tweetId, userId, title, contents, views, agrees, deleted, createdAt, updatedAt},
    		...
    	]
    }
    ```
    
    ➡️ 게시글 목록에는 제목, 작성자, 해시태그, 작성일, 좋아요 수, 조회수 포함
    
    ➡️ **Ordering** (= Sorting, 정렬)
    
    ☑️ 사용자는 게시글 목록을 원하는 값으로 정렬 가능 (default: **작성일** & **작성일, 좋아요 수, 조회수 중 1개만 선택 가능)**
    ☑️ 오름차 순, 내림차 순 선택 가능
    
    ➡️ **Searching** (= 검색)
    
    ☑️ 사용자는 입력한 키워드로 해당 키워드를 포함한 게시물 조회 가능
    
    ☑️ # Like 검색, 해당 키워드가 문자열 중 포함된 데이터 검색
    
    ☑️ 검색 방법1. some-url?search=후기 → “후기”가 제목에 포함된 게시글 목록
    
    ➡️ **Filtering** (= 필터링)
    
    ☑️ 사용자는 지정한 키워드로 해당 키워드를 포함한 게시물 필터링 가능
    
    ☑️ 예시1. some-url?hashtags=서울 → “서울” 해시태그를 가진 게시글 목록
    
    ☑️ 예시2. some-url?hashtags=서울,맛집 → “서울"과 “맛집" 해시태그를 모두 가진 게시글 목록
    
    ➡️ **Pagination** (= 페이지 기능)
    
    ☑️ 사용자는 1페이지 당 게시글 수 조정 가능 (default: 10건)
    
    
## 🗺 REST API

|  | Method | route |
| --- | --- | --- |
| 회원가입 | POST | /users/signup |
| 로그인 | POST | /users/signin |
| 마이페이지 | GET | /users/me |
| 게시글 작성 | POST | /tweets/create |
| 게시글 수정 | PATCH | /tweets/update/:tweetId |
| 게시글 삭제 | PATCH | /tweets/delete/:tweetId |
| 삭제 게시글 복구 | PATCH | /tweets/revoke/:tweetId |
| 상세 게시글 조회 | GET | /tweets/:tweetId |
| 게시글 리스트 조회 | GET | /tweets |
| 게시글 sorting | GET | /tweets?sortby=a&orderby=desc |
| 게시글 searching | GET | /tweets?search=a |
| 게시글 filtering | GET | /tweets?hashTags=a,b |
| 게시글 pagination | GET | /tweets?pageNum=1&limit=1 |


# 🛠 기술 스택

![image](https://img.shields.io/badge/BACK-JavaScript-%23F7DF1E?style=for-the-badge&logo=JavaScript)

![image](https://img.shields.io/badge/BACK-Node.js-%23339933?style=for-the-badge&logo=Node.js)

![image](https://img.shields.io/badge/BACK-EXPRESS-%23000000?style=for-the-badge&logo=Express)

![image](https://img.shields.io/badge/BACK-Sequelize-%2352B0E7?style=for-the-badge&logo=Sequelize)

![image](https://img.shields.io/badge/BACK-MySQL-%234479A1?style=for-the-badge&logo=MySQL)

![image](https://img.shields.io/badge/BACK-JWT-%23000000?style=for-the-badge&logo=JSON%20Web%20Tokens)


# 🎛 데이터베이스 모델링

1. 유저 테이블
    
    ☑️ id - `PK`, `auto increment`
    
    ☑️ userId - 사용자 이메일
    
    ☑️ password - 사용자 비밀번호
    
    ☑️ userName - 사용자 이름
    
    ☑️ nickName - 사용자 닉넴임
    
    ☑️ createdAt - 생성날짜 (`default Date()`)
    
2. 게시글 테이블
    
    ☑️ tweetId - `PK`, `auto increment`
    
    ☑️ userId - `FK` (유저 테이블_id)
    
    ☑️ title - 제목
    
    ☑️ contents - 내용
    
    ☑️ views - 조회수
    
    ☑️ agrees - 좋아요 수
    
    ☑️ deleted - 존재 상태 (게시글 생성시 `default false`, true: 삭제, false: 존재)
    
    ☑️ createdAt - 생성날짜 (`default Date()`)
    
    ☑️ updatedAt - 수정날짜 (게시글 생성시 `null`, `default Date()`)
    
3. 해시태그 
    
    ☑️ hashTagId - `PK`, `auto increment`
    
    ☑️ tweetId - `FK` (게시글 테이블_tweetId)
    
    ☑️ hashTags - 해시태그 (내용 리스트 형태로)
    

## 데이터베이스 모델링 (RDBMS)
![image](https://user-images.githubusercontent.com/73332608/180346668-c8b93703-2f07-4a1e-9c55-8540250081b9.png)


# 💡 기능 개발

## 💽 데이터베이스 설정

✔︎ `Sequelize` , 즉 ORM을 이용하여 DB를 연동했다.

```jsx
// db/database.js

import mysql from 'mysql2';
import { config } from '../config.js';
import SQ from 'sequelize';

/**
 * Sequelize 연동하기
 */
const { host, user, database, password } = config.db;
export const sequelize = new SQ.Sequelize(database, user, password, {
    host,
    dialect: 'mysql',
    logging: false,
});

```

```jsx
// data/users.js

import SQ from 'sequelize';
import { sequelize } from '../db/database.js';
const DataTypes = SQ.DataTypes;

export const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    userName: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    nickName: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
});
```

```jsx
// data/tweets.js

import SQ from 'sequelize';
import { sequelize } from '../db/database.js';
import { User } from './users.js';
import { HashTag } from './hashTags.js';
const DataTypes = SQ.DataTypes;
const Sequelize = SQ.Sequelize;

export const Tweet = sequelize.define('tweet', {
    tweetId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING(1024),
        allowNull: false,
    },
    contents: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    views: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    agrees: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    deleted: {  // 삭제 여부 -> false: 존재, true: 삭제
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
});
User.hasMany(Tweet, {foreignKey: 'userId'});
Tweet.belongsTo(User, {foreignKey: 'userId'});
Tweet.belongsToMany(HashTag, {as: 'hashtags', through: 'tweets_hashtags', foreignKey: 'tweetId'});
HashTag.belongsToMany(Tweet, {as: 'tweets', through: 'tweets_hashtags', foreignKey: 'hashTagId'});
```

```jsx
// data/hashTags.js
import SQ from 'sequelize';
import { sequelize } from '../db/database.js';
const DataTypes = SQ.DataTypes;
const Sequelize = SQ.Sequelize;

export const HashTag = sequelize.define('hashtag', {
    hashTagId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    hashTags: {
        type: DataTypes.STRING(128),
        allowNull: true,
    }
});
```
