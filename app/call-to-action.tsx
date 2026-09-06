import Link from "next/link";
import { ArrowRight } from "lucide-react";
export function CallToAction(){return <section className="cta-section"><div className="wrap cta-inner"><div><span className="section-kicker">START SMALL</span><h2>먼저 한 장을 직접 확인해 보세요.</h2><p>우리 치과의 설명 방식과 환자에게 잘 맞는지 살펴보세요.</p></div><div><Link className="btn primary" href="/sample">무료 샘플 받아보기 <ArrowRight size={18}/></Link><Link className="text-link" href="/contact">도입 문의하기</Link></div></div></section>}
