import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Post } from '../types';
import PageHeader from '../components/layout/PageHeader';
import { FaCalendarAlt, FaFileDownload, FaArrowLeft } from 'react-icons/fa';
import styles from './PostDetail.module.css';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      const numericId = Number(id);

      if (isNaN(numericId)) {
        console.error("ID inválido");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('posts')
        .select(`*, post_categories ( name )`)
        .eq('id', numericId)
        .single();

      if (!error && data) {
        setPost(data as unknown as Post);
      }
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  if (loading) return <div style={{textAlign:'center', padding:'50px'}}>Cargando...</div>;
  if (!post) return <div style={{textAlign:'center', padding:'50px'}}>No encontrado.</div>;

  return (
    <>
      <PageHeader title={post.post_categories?.name || 'Noticia'} />
      
      <div className={styles.container}>
        
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <FaArrowLeft /> Regresar
        </button>

        <h1 className={styles.title}>{post.title}</h1>
        <span className={styles.date}>{post.published_at}</span>

        {post.image_url && (
          <img 
            src={post.image_url} 
            alt={post.title} 
            className={styles.mainImage} 
          />
        )}

        <div className={styles.content}>
          {post.content}
        </div>

        {/* Botones de acción si existen vínculos */}
        {(post.linked_event_id || post.linked_document_id) && (
          <div className={styles.relatedSection}>
            <h3 className={styles.relatedTitle}>Recursos relacionados</h3>
            <div className={styles.relatedButtons}>
                
                {post.linked_event_id && (
                  <button 
                    onClick={() => navigate(`/participa/${post.linked_event_id}`)} 
                    className={`${styles.actionBtn} ${styles.eventBtn}`}
                  >
                    <FaCalendarAlt /> Ver Evento
                  </button>
                )}

                {post.linked_document_id && (
                  <a 
                    href={`/documentos?id=${post.linked_document_id}`} 
                    className={`${styles.actionBtn} ${styles.docBtn}`}
                  >
                    <FaFileDownload /> Ver Documento
                  </a>
                )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PostDetail;