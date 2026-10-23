"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

type Board = "notice" | "resource";
type Post = { id:string; title:string; content:string; external_url:string | null; created_at:string; updated_at:string };
const PAGE_SIZE = 8;

function formatDate(value:string) { return new Intl.DateTimeFormat("ko-KR", { year:"numeric", month:"2-digit", day:"2-digit" }).format(new Date(value)); }

export function BoardPage({ board }:{ board:Board }) {
  const [posts,setPosts]=useState<Post[]>([]); const [loading,setLoading]=useState(true); const [error,setError]=useState("");
  const [term,setTerm]=useState(""); const [draft,setDraft]=useState(""); const [page,setPage]=useState(1); const [selected,setSelected]=useState<Post|null>(null);
  const label=board==="notice"?"공지사항":"자료실";
  useEffect(()=>{ let active=true; (async()=>{
    if(!supabase){ if(active){setError("게시판 연결을 준비하고 있습니다.");setLoading(false)} return; }
    const {data,error}=await supabase.from("board_posts").select("id,title,content,external_url,created_at,updated_at").eq("board",board).eq("is_published",true).order("created_at",{ascending:false});
    if(!active)return; if(error)setError("게시글을 불러오지 못했습니다. 잠시 후 다시 확인해 주세요."); else setPosts(data??[]); setLoading(false);
  })(); return()=>{active=false}; },[board]);
  const searched=useMemo(()=>posts.filter(p=>p.title.toLowerCase().includes(term.toLowerCase())),[posts,term]);
  const pages=Math.max(1,Math.ceil(searched.length/PAGE_SIZE)); const current=Math.min(page,pages); const visible=searched.slice((current-1)*PAGE_SIZE,current*PAGE_SIZE);
  function search(e:FormEvent){e.preventDefault();setTerm(draft.trim());setPage(1);setSelected(null)}
  if(selected) return <main className="board-shell"><BoardHeader active={board}/><section className="board-wrap post-detail"><Link className="board-back" href={`/${board==="notice"?"notices":"resources"}/`}>← {label} 목록</Link><p className="board-kicker">{label}</p><h1>{selected.title}</h1><time dateTime={selected.created_at}>{formatDate(selected.created_at)}</time><div className="post-content">{selected.content.split("\n").map((line,i)=><p key={i}>{line||" "}</p>)}</div>{selected.external_url&&<a className="board-external" href={selected.external_url} target="_blank" rel="noreferrer">관련 자료 열기 ↗</a>}<p className="board-safety">의료 안내자료는 최종 사용 전 담당 치과의사가 확인해야 합니다.</p></section></main>;
  return <main className="board-shell"><BoardHeader active={board}/><section className="board-wrap"><p className="board-kicker">BRIDGE DENTAL NOTE</p><h1>{label}</h1><p className="board-intro">브릿지 덴탈 노트의 {label}을 확인하세요.</p><form className="board-search" onSubmit={search}><label className="sr-only" htmlFor="board-search">제목 검색</label><input id="board-search" value={draft} onChange={e=>setDraft(e.target.value)} placeholder="제목으로 검색"/><button type="submit">검색</button></form>{loading?<p className="board-status">게시글을 불러오는 중입니다.</p>:error?<p className="board-status">{error}</p>:<><div className="board-list" role="list">{visible.map((post)=><button className="board-row" key={post.id} onClick={()=>setSelected(post)} role="listitem"><span>{post.title}</span><time dateTime={post.created_at}>{formatDate(post.created_at)}</time></button>)}</div>{searched.length===0&&<p className="board-status">{term?"검색 결과가 없습니다.":"등록된 게시글이 없습니다."}</p>}{searched.length>PAGE_SIZE&&<nav className="board-pages" aria-label="페이지 이동">{Array.from({length:pages},(_,i)=><button key={i} className={current===i+1?"is-current":""} onClick={()=>setPage(i+1)} aria-current={current===i+1?"page":undefined}>{i+1}</button>)}</nav>}</>}<p className="board-safety">의료 안내자료는 최종 사용 전 담당 치과의사가 확인해야 합니다.</p></section></main>;
}

export function BoardHeader({active}:{active:Board}) { return <header className="board-header"><div className="board-header-inner"><Link className="board-brand" href="/bridge-home/">BRIDGE DENTAL NOTE</Link><nav aria-label="게시판 메뉴"><Link href="/bridge-home/">홈</Link><Link aria-current={active==="notice"?"page":undefined} href="/notices/">공지사항</Link><Link aria-current={active==="resource"?"page":undefined} href="/resources/">자료실</Link><Link href="/admin/">관리자</Link></nav></div></header> }
