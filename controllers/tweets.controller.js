import * as tweetRepository from '../data/tweets.js';


/**
 * 📌 TODO - ADVANCED 🔥
 * 1. SORTING ☑️
 * (작성일, 좋아요 수, 조회수 중 하나 선택해서 정렬 / 내림차순, 오름차순 선택 가능) 
 * 2. SEARCHING ☑️
 * (제목 검색 (키워드))
 * 3. FILTERING 
 * 이부분은 해시태그를 먼저 구현하고 진행해보자.
 * (해시태그 이용하여 해당 키워드 포함한 게시물 필터링)
 * 4. PAGINATION 
 * (1페이지 당 게시글 수 조정 가능) 
 */ 

export async function createTweet(req, res) {
    /**
     * 기능: 게시글 생성 
     * 특이사항: 작성자 정보는 req.body가 아닌 API단에서 토큰에서 얻은 사용자 
     * 정보를 이용함.
     * ➡️ 해당 정보는 미들웨어의 users.js에서 토큰을 통해 req.id에 새로 저장했음
     */
    const { title, contents } = req.body;
    const hashTag = contents.match(/#[^\s#]*/g);
    const tweet = await tweetRepository.create(title, contents, hashTag, req.id);

    return res.status(201).json({ 
        message: "게시물이 생성됐습니다!",
        tweet: tweet.dataValues
    });
}

export async function getTweet(req, res) {
    /**
     * 기능: 게시글 상세 조회
     */
    const tweetId = req.params.tweetNum;
    const tweet = await tweetRepository.getById(tweetId);
    await tweetRepository.addViews(tweetId);
    if (tweet) {
        return res.status(200).json(tweet);
    } else {
        res.status(404).json({ message: `게시글 id(${tweetId})이 존재하지 않습니다!` });
    }
}

export async function getTweets(req, res) {
    /**
     * 기능: 게시글 리스트 조회
     * 1. 쿼리에 userId에 대한 검색이 포함된 경우 해당 유저가 작성한 리스트만 포함
     * 2. 아닌 경우엔 모든 리스트 홤
     */
    let data;
    const { orderby, sortby, search, pageNum, limit, hashTags } = req.query;

    // 전체 리스트
    data = await (
        orderby === 'desc' ?
        tweetRepository.getAllDESC() : tweetRepository.getAllASC()
    )
    
    // SORTING - createdAt, agrees, views
    if (orderby === 'desc') {
        if (sortby === 'views') {
            data = await tweetRepository.getAllSortedByViewsDESC();
        } else if (sortby === 'agrees') {
            data = await tweetRepository.getAllSortedByAgreesDESC();
        } else {
            data = await tweetRepository.getAllDESC();
        }
    } else {
        if (sortby === 'views') {
            data = await tweetRepository.getAllSortedByViewsASC();
        } else if (sortby === 'agrees') {
            data = await tweetRepository.getAllSortedByAgreesASC();
        } else {
            data = await tweetRepository.getAllASC();
        }
    }

    // SEARCHING - title
    if (search) {
        data = await (
            orderby === 'desc' ?
            tweetRepository.getSearchedTitleDESC(search) : tweetRepository.getSearchedTitleASC(search)
        )
    }

    // FILTERING - HashTags
    if (hashTags) {
        const hashTag = hashTags.split(',');
        
    }

    // PAGINATION
    if (pageNum > 1 && limit) {
        const offset = limit * (pageNum - 1);
        data = await tweetRepository.getPagination(offset);
    }


    return res.status(200).json(data);
}

export async function updateTweet(req, res) {
    /**
     * 기능: 게시글 수정
     */
    const tweetId = req.params.tweetNum;
    const { title, contents } = req.body;
    const hashTag = contents.match(/#[^\s#]*/g);
    const tweet = await tweetRepository.getById(tweetId);
    if (!tweet) {
        return res.status(404).json({ message: `Tweet does not exist: ${tweetId}` });
    }
    if (tweet.dataValues.userId !== req.id) {
        return res.sendStatus(403);
    }
    const updated = await tweetRepository.update(tweetId, title, contents, hashTag);
    return res.status(200).json({
        message: '게시물이 수정됐습니다!',
        updatedTweet: updated.dataValues,
    });
}

export async function deleteTweet(req, res) {
    /**
     * 기능: 게시글 삭제
     * deleted=true 할당하면 삭제 상태로 바뀜
     */
    const tweetId = req.params.tweetNum;
    const tweet = await tweetRepository.getById(tweetId);
    if (!tweet) {
        return res.status(404).json({ message: `Tweet does not exist: ${tweetId}` });
    }
    if (tweet.dataValues.userId !== req.id) {
        return res.sendStatus(403);
    }
    const deleted = await tweetRepository.remove(tweetId);
    return res.status(200).json({
        message: '게시물이 삭제됐습니다!',
        deletedTweet: deleted.dataValues,
    })
}

export async function revokeTweet(req, res) {
    /**
     * 삭제 게시글 복구
     * deleted=false 할당하면 삭제 상태에서 복구 상태로 바뀜
     */
    const tweetId = req.params.tweetNum;
    const tweet = await tweetRepository.getById(tweetId);
    if (!tweet) {
        return res.status(404).json({ message: `Tweet does not exist: ${tweetId}` });
    }
    if (tweet.dataValues.userId !== req.id) {
        return res.sendStatus(403);
    }
    const revoked = await tweetRepository.revoke(tweetId);
    return res.status(200).json({
        message: '게시물이 복구됐습니다!',
        revokedTweet: revoked.dataValues,
    });
}