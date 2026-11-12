import React, { useEffect, useState } from "react";
import api from "../../../Api";
import config from "../../../Config";
import { toFriendModel } from "./friendModel";
import "../../../styles/FriendSearch.css";

// TODO ①: 이 함수의 throw 한 줄을 실제 검색 요청으로 교체하세요.
// 힌트: return api.get(주소, { params: {...}, signal });
function requestSearch(nickname, page, signal) {
  return api.get(config.FOLLOW.SEARCH, {
    params: {
      nickname: nickname,
      page: page,
      size: 10,
    },
    signal: signal,
  });
}

function FriendSearch({
  onFollow,
  followingList = [],
  followingId = null,
  followError = "",
  followDisabled = false,
  refreshKey = 0,
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  const [results, setResults] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const nickname = query.trim();

  useEffect(() => {
    if (!nickname) {
      setResults([]);
      setTotalPages(0);
      setError("");
      setLoading(false);
      return;
    }

    let active = true;
    const controller = new AbortController();

    setLoading(true);
    setError("");
    setResults([]);

    const timer = setTimeout(async () => {
      try {
        const { data } = await requestSearch(
          nickname,
          page,
          controller.signal
        );

        if (
          data?.isSuccess === false ||
          !Array.isArray(data?.result?.content) ||
          !Number.isInteger(data.result.totalPages) ||
          data.result.totalPages < 0
        ) {
          throw new Error("검색 응답을 확인해 주세요.");
        }

        if (!active) return;

        // 팔로우로 마지막 페이지가 사라졌다면 유효한 페이지로 이동합니다.
        if (page > 0 && page >= data.result.totalPages) {
          setPage(Math.max(0, data.result.totalPages - 1));
          return;
        }

        setResults(data.result.content.map(toFriendModel));
        setTotalPages(data.result.totalPages);
      } catch {
        if (active) {
          setError("검색에 실패했습니다. 다시 시도해 주세요.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
      controller.abort();
    };
  }, [nickname, page, retryCount, refreshKey]);

  const handleChange = (event) => {
    const nextQuery = event.target.value;
    setQuery(nextQuery);
    // 새 검색을 기다리는 동안 예전 결과의 버튼을 누르지 않게 합니다.
    // 앞뒤 공백만 바뀌어 검색어가 같다면 현재 결과를 유지합니다.
    if (nextQuery.trim() !== nickname) {
      setPage(0);
      setResults([]);
      setError("");
    }
  };

  return (
    <section className="friend-search">
      <h2 className="friend-search__title">팔로우 요청</h2>

      <div className="friend-search__input-box">
        <input
          className="friend-search__input"
          aria-label="닉네임 검색"
          placeholder="닉네임으로 검색"
          value={query}
          onChange={handleChange}
        />
      </div>

      {followError && <p role="alert">{followError}</p>}

      {!nickname ? (
        <p>검색할 닉네임을 입력해 주세요.</p>
      ) : loading ? (
        <p role="status">검색 중...</p>
      ) : error ? (
        <div>
          <p role="alert">{error}</p>
          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
          >
            다시 시도
          </button>
        </div>
      ) : results.length === 0 ? (
        <p>검색 결과가 없습니다.</p>
      ) : (
        <ul className="friend-search__list">
          {results.map((user) => {
            const isFollowing = followingList.some(
              (friend) => friend.id === user.id
            );
            const isPending = followingId === user.id;

            return (
              <li key={user.id} className="friend-search__item">
                <div className="friend-info">
                  <div className="friend-info__top">
                    <span className="friend-info__name">{user.name}</span>
                    {user.tag && (
                      <span className="friend-info__tag">#{user.tag}</span>
                    )}
                  </div>
                  <p>{user.bio || "소개글이 없습니다."}</p>
                </div>

                <button
                  type="button"
                  className="friend-follow-btn"
                  disabled={
                    isFollowing ||
                    followingId !== null ||
                    followDisabled
                  }
                  onClick={() => onFollow?.(user)}
                >
                  {isPending ? "처리 중..." : isFollowing ? "팔로잉" : "팔로우"}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {nickname && !loading && !error && totalPages > 1 && (
        <div>
          <button
            type="button"
            disabled={page === 0 || followingId !== null}
            onClick={() => setPage((value) => value - 1)}
          >
            이전
          </button>
          <span> {page + 1} / {totalPages} </span>
          <button
            type="button"
            disabled={page + 1 >= totalPages || followingId !== null}
            onClick={() => setPage((value) => value + 1)}
          >
            다음
          </button>
        </div>
      )}
    </section>
  );
}

export default FriendSearch;