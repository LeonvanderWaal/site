<h2>How to efficiently compute roots of polynomials modulo p</h2>
Today, I will show a computationally efficient method for finding roots of a polynomial $f$ in the discrete field $\mathbb{F}_p$. It is important to note that this algorithm might not be the best algorithm in all cases, as specialized, more efficient methods exist for small polynomials, and small values of $p$ allow us to check all possible roots by brute force in $O(np)$. Therefore, it is assumed that $n$ and $p$ are both large, and that $ n \ll p $, so that we would ideally have an algorithm that is polynomial in the number of bits - or $\log(p)$.

To this end, we 
