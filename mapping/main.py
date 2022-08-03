
from db import gdb

import paramiko
from scp import SCPClient
import time




def upload_file(local_file, remote_path):
    ssh = paramiko.SSHClient()
    key = paramiko.AutoAddPolicy()
    ssh.set_missing_host_key_policy(key)
    ssh.connect('10.60.103.248', 21122, 'cjt', 'chenjianting1234', timeout=100)
    scp = SCPClient(ssh.get_transport(), socket_timeout=15)
    scp.put(local_file, remote_path)
    # try:
    #     scp.put(local_file, remote_path)
    # except FileNotFoundError as e:
    #     print(e)
    #     print("系统找不到指定文件" + local_file)
    # else:
    #     print("***" * 30)
    #     print("文件上传成功" + local_file + ' to ' + remote_path)
    ssh.close()



def exec_command(str, get_pty=False):
    ssh = paramiko.SSHClient()
    key = paramiko.AutoAddPolicy()
    ssh.set_missing_host_key_policy(key)
    ssh.connect('10.60.103.248', 21122, 'cjt', 'chenjianting1234', timeout=100)
    stdin, stdout, stderr = ssh.exec_command(str, get_pty=get_pty)
    if get_pty:
        time.sleep(1)
        stdin.write('chenjianting1234\n')
    # print("***" * 30)
    # for i in stdout.readlines():
    #     print(i,end='')
    # if len(stderr.readlines()) == 0:
    #     print("命令执行成功")
    ssh.close()
    return stdin, stdout, stderr




def virtuoso_load(remote_path, graph_iri, ext='*.nt'):

    #exec_command('sudo mv -f ./mapping/dump.nt ./data/virtuoso/dump.nt')
    #exec_command('sudo -S chown root ./data/virtuoso/dump.nt')
    # exec_command('ls ./data/virtuoso -l')

    cmd = 'sudo -S docker exec -it virtuoso isql 1111 dba DBA ' \
          'exec="ld_dir(\'{}\', \'{}\', \'{}\'); ' \
                   'rdf_loader_run(); ' \
                   'checkpoint; ' \
                   'select * from db.dba.load_list; ' \
                   'delete from db.dba.load_list; " ' \
          ''.format(remote_path, ext, graph_iri)
    print(cmd)
    return exec_command(cmd, True)




select_path ="""prefix :<http://relation_graph/SIPG/v1#> 
                prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> 
                prefix xsd: <http://www.w3.org/2001/XMLSchema#> 
                with <http://SIPG/RelationGraph/v2#>
                    select ?order ?p1 ?tp1 ?p2 ?tp2 {
                               ?p1  :BELONG_TO_ORDER   ?order.
                               ?p2 :BELONG_TO_ORDER   ?order.
                               ?p2 :INOUT_TIME ?t2 .
                               ?p1 :INOUT_TP ?tp1 .
                               ?p2 :INOUT_TP ?tp2 .
                               filter(xsd:dateTime(?t2) = ?t_end)                    
                     {select ?order ?p1  min(?t_end) as ?t_end  {
                               ?p1  :BELONG_TO_ORDER   ?order.
                               ?p2 :BELONG_TO_ORDER   ?order.
                               ?p1 :INOUT_TIME ?t1 .
                               ?p2 :INOUT_TIME ?t2 .
                               ?p1 :INOUT_TP ?tp1 .
                               ?p2 :INOUT_TP ?tp2 .
                               filter(xsd:dateTime(?t1) = ?t_start)
                               filter(xsd:dateTime(?t2) = ?t_end)
                               filter(?t_end> ?t_start)
                    
                    {select ?order min( xsd:dateTime(?t1)) as ?t_end ?tp2  {
                               ?p1  :BELONG_TO_ORDER   ?order.
                               ?p1 :INOUT_TIME ?t1 .
                               ?p1 :INOUT_TP ?tp2.
                     }group by ?order ?tp2}                
                    {select ?order max( xsd:dateTime(?t1)) as ?t_start ?tp1  {
                               ?p1  :BELONG_TO_ORDER  ?order.
                               ?p1 :INOUT_TIME ?t1 .
                               ?p1 :INOUT_TP ?tp1.
                     }group by ?order ?tp1} 
                    }group by ?order ?p1}
                    }
                """

"""
                prefix :<http://relation_graph/SIPG/v1#> 
                prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> 
                prefix xsd: <http://www.w3.org/2001/XMLSchema#> 
                with <http://SIPG/RelationGraph/v2#>

insert  {
          ?path a :PATH .
          ?path :PATH_TO_ORDER ?order .
          ?path :PATH_START_POINT ?p1 .
          ?path :PATH_END_POINT ?p2 .
}
where {
           ?p1  :BELONG_TO_ORDER   ?order.
           ?p2 :BELONG_TO_ORDER   ?order.
           ?p1 :ID ?p1id .
           ?p2 :ID ?p2id .
           ?p2 :INOUT_TIME ?t2 .
           ?p1 :INOUT_TP ?tp1 .
           ?p2 :INOUT_TP ?tp2 .
           filter(xsd:dateTime(?t2) = ?t_end)
           filter (?order = <http://order_87483335>)
           bind( iri(CONCAT("http://path_", ?p1id ,"|" , ?tp1, "_", ?p2id  ,"|" , ?tp2)) AS ?path )

 {select ?order ?p1  min(?t_end) as ?t_end  {
           ?p1  :BELONG_TO_ORDER   ?order.
           ?p2 :BELONG_TO_ORDER   ?order.
           ?p1 :INOUT_TIME ?t1 .
           ?p2 :INOUT_TIME ?t2 .
           ?p1 :INOUT_TP ?tp1 .
           ?p2 :INOUT_TP ?tp2 .
           filter(xsd:dateTime(?t1) = ?t_start)
           filter(xsd:dateTime(?t2) = ?t_end)
           filter(?t_end> ?t_start)

{select ?order min( xsd:dateTime(?t1)) as ?t_end ?tp2  {
           ?p1  :BELONG_TO_ORDER   ?order.
           ?p1 :INOUT_TIME ?t1 .
           ?p1 :INOUT_TP ?tp2.
 }group by ?order ?tp2}                
{select ?order max( xsd:dateTime(?t1)) as ?t_start ?tp1  {
           ?p1  :BELONG_TO_ORDER  ?order.
           ?p1 :INOUT_TIME ?t1 .
           ?p1 :INOUT_TP ?tp1.
 }group by ?order ?tp1} 
}group by ?order ?p1}
}
"""





if __name__ == '__main__':
    g_conn, g_cursor = gdb.connect_graph_db()

    #upload_file('./mapping.ttl', '/home/cjt/mapping')
    #
    #exec_command('./mapping/d2rq-0.8.1/dump-rdf ./mapping/mapping.ttl > ./mapping/dump.nt')

    virtuoso_load('/database', 'http://SIPG/RelationGraph/v2#')




