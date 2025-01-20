#include<bits/stdc++.h>
using namespace std;
    Node* iop(Node* root){
        Node* pred= root->left;
        while(pred->right!=NULL){
            pred=pred->right;
        }
        return pred;
    }
Node* deleteNode(Node* root, int key){
    if(root==NULL)  return NULL;
    if(root->val == Key){
        if(root->right==NULL && root->left == NULL){
            return NULL;
        }
        if(root->left==NULL || root->right==NULL){
            if(root->left) return root->left;
        }
        if(root-> right && root->left){
            Node* pred = iop(root);
            root->val = pred->val;
            root->left = deleteNode(root->left,pred->val);
        }
    }
}
int main(){

}