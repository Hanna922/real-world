import { useState } from 'react'

import { useRecoilState } from 'recoil'

import { ArticlePreview } from '@/components/ArticlePreview'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { Pagination } from '@/components/pagination/Pagination'
import { useGetArticles } from '@/hooks/useGetArticles'
import { useGetTags } from '@/hooks/useGetTags'
import { useUser } from '@/hooks/useUser'
import { TagObject } from '@/lib/client/objects'
import { homePageTagState } from '@/state/homePageTag.state'

function PopularTags({
  tags,
  switchFeedMode,
}: {
  tags: TagObject[]
  switchFeedMode: (mode: 'your' | 'global' | 'tag') => void
}) {
  const [, setHomePageTag] = useRecoilState(homePageTagState)

  const tagClickHandler = (e: React.MouseEvent<HTMLAnchorElement>, tag: string) => {
    e.preventDefault()
    switchFeedMode('tag')
    setHomePageTag(tag)
  }

  return (
    <div className="col-md-3">
      <div className="sidebar">
        <p>Popular Tags</p>

        <div className="tag-list">
          {tags.map((tag) => {
            return (
              <a
                href=""
                className="tag-pill tag-default"
                key={tag}
                onClick={(e) => tagClickHandler(e, tag)}
              >
                {tag}
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const HomePage = () => {
  const { user, isLogin } = useUser()
  const [page, setPage] = useState(1)

  const [feedMode, setFeedMode] = useState<'your' | 'global' | 'tag'>('global')
  const { tags } = useGetTags()
  const [selectTag, setSelectTag] = useRecoilState(homePageTagState)
  const { articles, articlesCount } = useGetArticles({
    limit: 10,
    offset: (page - 1) * 10,
    favorited: feedMode === 'your' ? user?.username : undefined,
    tag: feedMode === 'tag' ? selectTag : undefined,
  })

  const switchFeedMode = (
    e: React.MouseEvent<HTMLAnchorElement>,
    mode: 'your' | 'global' | 'tag'
  ) => {
    e.preventDefault()
    setFeedMode(mode)
  }

  return (
    <>
      <Navbar />
      <div className="home-page">
        <div className="banner">
          <div className="container">
            <h1 className="logo-font">conduit</h1>
            <p>A place to share your knowledge.</p>
          </div>
        </div>

        <div className="container page">
          <div className="row">
            <div className="col-md-9">
              <div className="feed-toggle">
                <ul className="nav nav-pills outline-active">
                  {isLogin ? (
                    <li className="nav-item">
                      <a
                        className={`nav-link ${feedMode === 'your' ? 'active' : ''}`}
                        href=""
                        onClick={(e) => switchFeedMode(e, 'your')}
                      >
                        Your Feed
                      </a>
                    </li>
                  ) : (
                    <></>
                  )}
                  <li className="nav-item">
                    <a
                      className={`nav-link ${feedMode === 'global' ? 'active' : ''}`}
                      href=""
                      onClick={(e) => switchFeedMode(e, 'global')}
                    >
                      Global Feed
                    </a>
                  </li>
                  {selectTag ? (
                    <li className="nav-item">
                      <a
                        className={`nav-link ${feedMode === 'tag' ? 'active' : ''}`}
                        href=""
                        onClick={(e) => switchFeedMode(e, 'tag')}
                      >
                        #{selectTag}
                      </a>
                    </li>
                  ) : (
                    <></>
                  )}
                </ul>
              </div>
              {articles ? (
                articles.map((article) => (
                  <ArticlePreview
                    key={article.slug}
                    article={{
                      title: article.title,
                      slug: article.slug,
                      body: article.body,
                      author: {
                        bio: article.author.bio,
                        following: article.author.following,
                        image: article.author.image,
                        username: article.author.username,
                      },
                      createdAt: article.createdAt,
                      description: article.description,
                      favorited: article.favorited,
                      favoritesCount: article.favoritesCount,
                      tagList: article.tagList,
                      updatedAt: article.updatedAt,
                    }}
                  />
                ))
              ) : (
                <></>
              )}
              {articlesCount ? (
                <Pagination
                  totalPages={articlesCount}
                  limit={10}
                  currentPage={page}
                  setPage={setPage}
                />
              ) : (
                <></>
              )}
            </div>
            <PopularTags
              tags={tags}
              switchFeedMode={(mode) => {
                setFeedMode(mode)
                setSelectTag('')
              }}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default HomePage
